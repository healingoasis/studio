#!/usr/bin/env python3
"""
Grade a whole folder in place: grade each clip, VERIFY it, then release the original.

There is no backup of this footage and the Mac has no room to hold both copies,
so the verification below is the entire safety net. A clip's original is deleted
only after its graded version has been proved good. If a check fails, the
original stays and the clip is logged for a human to look at.

Resumable: re-running skips clips already recorded as done.
"""
import os, sys, json, subprocess, time, argparse
from analyze import FF
from grade import grade

LOG = None
def log(entry):
    with open(LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")

def done_set():
    if not os.path.exists(LOG): return set()
    out = set()
    for line in open(LOG):
        try:
            e = json.loads(line)
            if e.get("status") in ("done", "kept_failed_check"): out.add(e["file"])
        except Exception: pass
    return out

def probe_json(path):
    """Duration and frame count straight from the encoded file."""
    r = subprocess.run([FF, "-nostdin", "-i", path], capture_output=True, text=True).stderr
    dur = None
    for line in r.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            try:
                h, m, s = t.split(":"); dur = int(h)*3600 + int(m)*60 + float(s)
            except Exception: pass
    return dur, r

def verify(src, out, src_dur):
    """Prove the graded file is good before anything irreversible happens."""
    if not os.path.exists(out):
        return False, "no output file"
    size = os.path.getsize(out)
    if size < 200_000:
        return False, f"output suspiciously small ({size} bytes)"
    dur, err = probe_json(out)
    if dur is None:
        return False, "output has no readable duration"
    if abs(dur - src_dur) > max(0.5, src_dur * 0.02):
        return False, f"duration mismatch: source {src_dur:.2f}s, graded {dur:.2f}s"
    # decode the whole thing and fail on any decoder error
    r = subprocess.run([FF, "-nostdin", "-v", "error", "-i", out,
                        "-f", "null", "-"], capture_output=True, text=True)
    bad = [l for l in r.stderr.splitlines() if l.strip()]
    if bad:
        return False, "decode errors: " + "; ".join(bad[:2])[:200]
    return True, f"{dur:.2f}s, {size/1e6:.0f} MB"

def run(folder, bitrate="auto", limit=None, dry_run=False):
    clips = sorted(f for f in os.listdir(folder) if f.upper().endswith(".MP4")
                   and "_GRADED" not in f)
    skip = done_set()
    todo = [c for c in clips if c not in skip]
    if limit: todo = todo[:limit]
    print(f"{len(clips)} clips, {len(skip)} already done, {len(todo)} to go", flush=True)
    freed = 0
    for i, name in enumerate(todo, 1):
        src = os.path.join(folder, name)
        out = os.path.join(folder, os.path.splitext(name)[0] + "_GRADED.mp4")
        src_size = os.path.getsize(src)
        t0 = time.time()
        print(f"[{i}/{len(todo)}] {name} ({src_size/1e9:.2f} GB) ...", end=" ", flush=True)
        if dry_run:
            print("dry run"); continue
        free = os.statvfs(folder); free_b = free.f_bavail * free.f_frsize
        if free_b < 6e9:
            print(f"STOPPING: only {free_b/1e9:.1f} GB free", flush=True)
            log({"file": name, "status": "stopped_low_space"}); break
        try:
            m, res = grade(src, out, bitrate=bitrate)
        except Exception as e:
            print(f"ERROR {e}", flush=True)
            log({"file": name, "status": "error", "detail": str(e)}); continue
        if not isinstance(res, dict):
            print(f"ENCODE FAILED", flush=True)
            log({"file": name, "status": "encode_failed", "detail": str(res)[:300]})
            if os.path.exists(out): os.remove(out)
            continue
        ok, detail = verify(src, out, m["duration"])
        if not ok:
            print(f"CHECK FAILED ({detail}) - original kept", flush=True)
            log({"file": name, "status": "kept_failed_check", "detail": detail})
            continue
        out_size = os.path.getsize(out)
        os.remove(src)              # verified: safe to release the original
        freed += src_size - out_size
        el = time.time() - t0
        print(f"ok {detail}  ({el:.0f}s, freed {(src_size-out_size)/1e9:.2f} GB)", flush=True)
        log({"file": name, "status": "done", "graded": os.path.basename(out),
             "src_mb": round(src_size/1e6), "out_mb": round(out_size/1e6),
             "seconds": round(el), "exposure": m.get("exposure"),
             "bitrate": m.get("bitrate"), "aim_p50": m.get("p50"),
             "wb": [m.get("wb_r"), m.get("wb_b")]})
    print(f"\nfreed {freed/1e9:.1f} GB this run", flush=True)

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("--log", required=True)
    a.add_argument("--bitrate", default="auto")
    a.add_argument("--limit", type=int, default=None)
    a.add_argument("--dry-run", action="store_true")
    n = a.parse_args()
    LOG = n.log
    run(n.folder, bitrate=n.bitrate, limit=n.limit, dry_run=n.dry_run)
