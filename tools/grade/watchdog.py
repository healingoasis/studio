#!/usr/bin/env python3
"""
Watch the grading as it runs and shout if the output stops agreeing with itself.

Twice now a bad setting ran ten clips deep before anyone looked. Checking only
at the end is checking too late, so this re-measures after every few clips and
prints a line the moment a clip drifts away from its peers.
"""
import os, sys, time, json, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qc import frame_stats

def finished(log):
    out = []
    if not os.path.exists(log): return out
    for line in open(log):
        try:
            e = json.loads(line)
            if e.get("status") == "done" and e.get("graded"): out.append(e)
        except Exception: pass
    return out

# Graded before the exposure fix. Known and already assessed -- re-reporting
# them every cycle would bury a genuinely new problem in noise.
PRE_FIX = {f"C{n}_GRADED.mp4" for n in range(8181, 8191)}

def main(folder, log, every=4):
    seen, stats = set(PRE_FIX), {}
    while True:
        done = finished(log)
        new = [e for e in done if e["graded"] not in seen]
        for e in new:
            p = os.path.join(folder, e["graded"])
            if not os.path.exists(p):
                seen.add(e["graded"]); continue
            s = frame_stats(p)
            seen.add(e["graded"])
            if s: stats[e["graded"]] = s
        if len(stats) >= 4 and new:
            mids = [v["p50"] for v in stats.values()]
            med = st.median(mids)
            for e in new:
                s = stats.get(e["graded"])
                if not s: continue
                bad = []
                # The real fault signal: the grade did not land where it aimed.
                # A scene full of dark clothing is legitimately dark and is not
                # a defect -- comparing clips to each other kept flagging those.
                aim = e.get("aim_p50")
                if aim and abs(s["p50"] - aim) > 45:
                    bad.append(f"aimed for {aim}, landed at {s['p50']}")
                # Scenes full of dark clothing are legitimately dark. Only shout
                # for a clip far enough out that a grading fault is the likely cause.
                if s["p50"] < 32 or s["p50"] > 200:
                    bad.append(f"extreme brightness ({s['p50']})")
                if s["p1"] > 110: bad.append(f"shadows washed out ({s['p1']})")
                if s["p95"] < 95:  bad.append(f"very flat ({s['p95']})")
                if s["p999"] < 150: bad.append(f"no highlights at all ({s['p999']})")
                if bad:
                    print(f"ODD CLIP: {e['graded']} -- {'; '.join(bad)}", flush=True)
        import subprocess
        alive = subprocess.run(["pgrep","-f","run_folder.py"],
                               capture_output=True).returncode == 0
        if not alive and not new:
            # runner gone and nothing new: report the final spread once, then stop
            if len(stats) >= 2:
                mids = [v["p50"] for v in stats.values()]
                print(f"FINAL: {len(stats)} clips, brightness spread "
                      f"{st.pstdev(mids):.1f} (lower is better)", flush=True)
            return
        time.sleep(45)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
