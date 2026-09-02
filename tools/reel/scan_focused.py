#!/usr/bin/env python3
"""Score only the windows that actually contain needling, and rank them."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shotscore import score
B = "/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
WIN = [("C8192", 198, 234, 1.5, 0.42),   # insertion, shadowed
       ("C8192", 254, 280, 1.5, 0.45),   # same session, daylight
       ("C8188", 34, 50,  1.5, 0.54),    # horse, sharp window
       ("C8190", 1.5, 8.5, 1.0, 0.46)]   # shar pei
out = []
for clip, a, b, step, xoff in WIN:
    crop = f"crop=1215:2160:(iw-1215)*{xoff}:0"
    t = a
    while t <= b:
        s = score(f"{B}/{clip}_GRADED.mp4", t, crop=crop)
        if s:
            s["clip"] = clip; s["xoff"] = xoff
            out.append(s)
        t += step
    print(f"  {clip} {a}-{b}s done ({len(out)} scored)", flush=True)
out.sort(key=lambda r: -r["score"])
json.dump(out, open("shot_scores.json", "w"), indent=1)
print(f"\n  {'clip':7} {'t':>7} {'score':>6} {'sharp':>6} {'shake':>6} {'noise':>6}")
for r in out[:22]:
    print(f"  {r['clip']:7} {r['t']:>7} {r['score']:>6} {r['sharp']:>6} {r['shake']:>6} {r['noise']:>6}")
