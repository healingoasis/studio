#!/usr/bin/env python3
"""Rank every second of the acupuncture footage on technical quality."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shotscore import score

B = "/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
WINDOWS = [("C8192", 190, 320, 0.44), ("C8188", 30, 90, 0.52), ("C8190", 0.5, 8.5, 0.46)]

out = []
for clip, a, b, xoff in WINDOWS:
    crop = f"crop=1215:2160:(iw-1215)*{xoff}:0"
    t = a
    print(f"  scanning {clip} {a}-{b}s ...", flush=True)
    while t <= b:
        s = score(f"{B}/{clip}_GRADED.mp4", t, crop=crop)
        if s:
            s["clip"] = clip; s["xoff"] = xoff
            out.append(s)
        t += 1.0
out.sort(key=lambda r: -r["score"])
json.dump(out, open("shot_scores.json", "w"), indent=1)
print(f"\n  scored {len(out)} moments")
print(f"  {'clip':7} {'t':>7} {'score':>6} {'sharp':>6} {'shake':>6} {'noise':>6}")
for r in out[:25]:
    print(f"  {r['clip']:7} {r['t']:>7} {r['score']:>6} {r['sharp']:>6} {r['shake']:>6} {r['noise']:>6}")
