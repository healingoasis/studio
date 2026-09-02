#!/usr/bin/env python3
"""Find every 1.4-second RUN that passes certification, across all needling windows."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from certify import certify

B = "/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
LIM = {"sharp": 26.0, "shake": 5.5, "noise": 5.0, "specks": 25}
RUN = 1.4
WINDOWS = [
    ("C8192", 120, 140, 0.44), ("C8192", 196, 236, 0.42),
    ("C8192", 250, 286, 0.48), ("C8188", 32, 88, 0.52),
    ("C8190", 1.0, 8.0, 0.46), ("C8191", 2, 44, 0.46),
]
res = []
for clip, a, b, xoff in WINDOWS:
    crop = f"crop=1215:2160:(iw-1215)*{xoff}:0"
    t = a
    passed = 0
    while t + RUN <= b:
        c = certify(f"{B}/{clip}_GRADED.mp4", t, RUN, crop=crop, limits=LIM)
        rec = {"clip": clip, "t": round(t, 1), "xoff": xoff,
               "ok": c["ok"], "why": c.get("why", ""), **c.get("worst", {})}
        res.append(rec)
        if c["ok"]: passed += 1
        t += 1.6
    print(f"  {clip} {a}-{b}s: {passed} runs passed", flush=True)
json.dump(res, open("certified_runs.json", "w"), indent=1)
ok = [r for r in res if r["ok"]]
ok.sort(key=lambda r: (r["shake"], -r["sharp"]))
print(f"\n  {len(ok)} of {len(res)} runs passed")
print(f"  {'clip':7} {'t':>7} {'sharp':>6} {'shake':>6} {'noise':>6} {'specks':>7}")
for r in ok[:30]:
    print(f"  {r['clip']:7} {r['t']:>7} {r['sharp']:>6} {r['shake']:>6} "
          f"{r['noise']:>6} {r['specks']:>7}")
