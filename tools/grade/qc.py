#!/usr/bin/env python3
"""
Quality control across the graded output.

Grading 99 clips one at a time is only as good as the check that follows it.
This measures every finished file and flags the ones that do not agree with
the rest, which is how a bad clip gets caught without watching all 99.
"""
import os, sys, json, subprocess, argparse, statistics as st
from PIL import Image
from analyze import FF

def frame_stats(path, times=(0.25, 0.5, 0.75)):
    """Luma percentiles at a few points through the clip."""
    r = subprocess.run([FF, "-nostdin", "-i", path], capture_output=True, text=True).stderr
    dur = 0.0
    for line in r.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            try:
                h, m, s = t.split(":"); dur = int(h)*3600+int(m)*60+float(s)
            except Exception: pass
    if dur <= 0: return None
    out = []
    tmp = "/tmp/_qc_frame.png"
    for q in times:
        subprocess.run([FF, "-nostdin", "-ss", f"{dur*q:.2f}", "-i", path,
                        "-frames:v", "1", "-vf", "scale=240:-1",
                        "-pix_fmt", "rgb24", "-update", "1", "-y", tmp],
                       capture_output=True)
        if not os.path.exists(tmp): continue
        px = sorted(Image.open(tmp).convert("L").getdata())
        n = len(px)
        out.append((px[n//100], px[n//2], px[int(n*0.95)], px[int(n*0.999)]))
    if os.path.exists(tmp): os.remove(tmp)
    if not out: return None
    return {"dur": round(dur,2),
            "p1":  round(st.mean(o[0] for o in out)),
            "p50": round(st.mean(o[1] for o in out)),
            "p95": round(st.mean(o[2] for o in out)),
            "p999":round(st.mean(o[3] for o in out))}

def run(folder, log_path, verbose=False):
    # only files the runner recorded as finished -- a clip still being written
    # is not a fault, and flagging it as one just creates noise
    finished = set()
    if log_path and os.path.exists(log_path):
        for line in open(log_path):
            try:
                e = json.loads(line)
                if e.get("status") == "done" and e.get("graded"):
                    finished.add(e["graded"])
            except Exception: pass
    graded = sorted(f for f in os.listdir(folder) if f.endswith("_GRADED.mp4")
                    and (not finished or f in finished))
    if not graded:
        print("nothing graded yet"); return
    rows, problems = [], []
    for i, g in enumerate(graded, 1):
        p = os.path.join(folder, g)
        s = frame_stats(p)
        if s is None:
            problems.append((g, "unreadable")); continue
        s["file"] = g
        s["mb"] = round(os.path.getsize(p)/1e6)
        rows.append(s)
        if verbose: print(f"  [{i}/{len(graded)}] {g} p50={s['p50']}", flush=True)
    if not rows: 
        print("no readable output"); return
    mids = [r["p50"] for r in rows]
    med = st.median(mids)
    spread = st.pstdev(mids) if len(mids) > 1 else 0
    print(f"\n{len(rows)} graded clips checked")
    print(f"  midtone: median {med:.0f}, spread {spread:.1f} "
          f"(low spread = the clips match each other)")
    print(f"  range:   {min(mids)} to {max(mids)}")
    # a clip is suspect if it sits far from its peers, or is crushed/blown
    for r in rows:
        why = []
        if abs(r["p50"] - med) > 28: why.append(f"midtone {r['p50']} vs {med:.0f}")
        if r["p1"] > 95:             why.append(f"shadows washed ({r['p1']})")
        if r["p95"] < 110:           why.append(f"very flat ({r['p95']})")
        if r["mb"] < 3:              why.append(f"tiny file ({r['mb']} MB)")
        if why: problems.append((r["file"], "; ".join(why)))
    if problems:
        print(f"\n  {len(problems)} clip(s) worth a look:")
        for f, w in problems: print(f"    {f}: {w}")
    else:
        print("\n  no outliers - every clip agrees with the others")
    return rows, problems

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("--log", default=None)
    a.add_argument("-v", action="store_true")
    n = a.parse_args()
    run(n.folder, n.log, verbose=n.v)
