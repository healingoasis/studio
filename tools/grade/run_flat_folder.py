#!/usr/bin/env python3
"""
Grade a folder of flat 8-bit footage in place, then release the originals.

Same safety rule as the S-Log3 run: an original is deleted only after its
graded replacement has been proved good -- right duration, decodes cleanly end
to end, sensible size. Resumable; re-running skips what is recorded as done.
"""
import os, sys, json, subprocess, time, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from grade_flat import grade, probe

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def verify(src_dur, out):
    if not os.path.exists(out): return False, "no output"
    if os.path.getsize(out) < 200_000: return False, "suspiciously small"
    d, _, _, _ = probe(out)
    if d <= 0: return False, "no readable duration"
    if abs(d - src_dur) > max(0.5, src_dur * 0.02):
        return False, f"duration mismatch {src_dur:.1f} vs {d:.1f}"
    r = subprocess.run([FF, "-nostdin", "-v", "error", "-i", out, "-f", "null", "-"],
                       capture_output=True, text=True)
    bad = [l for l in r.stderr.splitlines() if l.strip()]
    if bad: return False, "decode errors: " + bad[0][:120]
    return True, f"{d:.1f}s, {os.path.getsize(out)/1e6:.0f} MB"

def done_set(log):
    s = set()
    if os.path.exists(log):
        for line in open(log):
            try:
                e = json.loads(line)
                if e.get("status") in ("done", "kept_failed_check"): s.add(e["file"])
            except Exception: pass
    return s

def run(folder, log, limit=None):
    clips = sorted(f for f in os.listdir(folder)
                   if f.upper().endswith(".MP4") and "_GRADED" not in f)
    skip = done_set(log)
    todo = [c for c in clips if c not in skip]
    if limit: todo = todo[:limit]
    print(f"{len(clips)} clips, {len(skip)} done, {len(todo)} to go", flush=True)
    freed = 0; fails = 0
    for i, name in enumerate(todo, 1):
        src = os.path.join(folder, name)
        out = os.path.join(folder, os.path.splitext(name)[0] + "_GRADED.mp4")
        ssz = os.path.getsize(src); t0 = time.time()
        print(f"[{i}/{len(todo)}] {name} ({ssz/1e9:.2f} GB) ...", end=" ", flush=True)
        free = os.statvfs(folder)
        if free.f_bavail * free.f_frsize < 5e9:
            print("STOPPING: low disk", flush=True); break
        sdur, _, _, _ = probe(src)
        res, err = grade(src, out)
        if res is None:
            print(f"FAILED ({err})", flush=True); fails += 1
            if os.path.exists(out): os.remove(out)
            with open(log, "a") as f:
                f.write(json.dumps({"file": name, "status": "failed",
                                    "detail": str(err)[:200]}) + "\n")
            if fails >= 5:
                print("STOPPING: 5 failures in a row", flush=True); break
            continue
        ok, detail = verify(sdur, out)
        if not ok:
            print(f"CHECK FAILED ({detail}) - original kept", flush=True); fails += 1
            with open(log, "a") as f:
                f.write(json.dumps({"file": name, "status": "kept_failed_check",
                                    "detail": detail}) + "\n")
            continue
        osz = os.path.getsize(out)
        os.remove(src)
        fails = 0; freed += ssz - osz
        print(f"ok {detail}  ({time.time()-t0:.0f}s, freed {(ssz-osz)/1e9:.2f} GB)",
              flush=True)
        with open(log, "a") as f:
            f.write(json.dumps({"file": name, "status": "done",
                "graded": os.path.basename(out), "src_mb": round(ssz/1e6),
                "out_mb": round(osz/1e6), "levels": res["levels"],
                "seconds": round(time.time()-t0)}) + "\n")
    print(f"\nfreed {freed/1e9:.1f} GB", flush=True)

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("--log", required=True)
    a.add_argument("--limit", type=int, default=None)
    n = a.parse_args()
    run(n.folder, n.log, limit=n.limit)
