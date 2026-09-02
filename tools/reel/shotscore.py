#!/usr/bin/env python3
"""
Score footage on technical quality BEFORE it is chosen for an edit.

Built after four rounds of picking shots for their content and only then
discovering they were soft, shaky or noisy. Judging those by eye on a contact
sheet does not work -- softness and camera shake are invisible at thumbnail
size and obvious at full screen. So measure them.

Four measures, all cheap:

  sharpness  edge energy. Soft focus and motion blur both crush it.
  steadiness frame-to-frame change at low resolution. Detail is scaled away,
             so what survives is whole-frame movement, i.e. camera shake.
  cleanness  residual after a light blur, in flat areas only. That residual is
             sensor noise; measuring it on flat regions avoids counting real
             texture as grain.
  exposure   clipped highlights and where the midtone sits.

The composite is deliberately harsh on sharpness and steadiness, because those
are the two a viewer reads instantly as "amateur" and neither can be fixed
afterwards. Noise can be reduced; focus cannot be recovered.
"""
import subprocess, os, sys, json, tempfile, argparse
from PIL import Image, ImageFilter

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def _frame(clip, t, w=540, crop=None):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "f.png")
        vf = (crop + ",") if crop else ""
        subprocess.run([FF, "-nostdin", "-ss", f"{t:.3f}", "-i", clip,
                        "-frames:v", "1", "-vf", f"{vf}scale={w}:-1",
                        "-update", "1", "-y", p], capture_output=True)
        if not os.path.exists(p):
            return None
        im = Image.open(p); im.load()
        return im.convert("L"), im.convert("RGB")

def sharpness(gray):
    e = gray.filter(ImageFilter.FIND_EDGES)
    d = list(e.getdata()); m = sum(d)/len(d)
    return (sum((x-m)**2 for x in d)/len(d)) ** 0.5

def cleanness(gray):
    """Noise measured only where the picture is flat, so fur is not counted."""
    blur = gray.filter(ImageFilter.GaussianBlur(2))
    g, b = list(gray.getdata()), list(blur.getdata())
    edges = list(gray.filter(ImageFilter.FIND_EDGES).getdata())
    flat = [abs(a-c) for a, c, e in zip(g, b, edges) if e < 18]
    if len(flat) < 200:
        return 0.0
    return sum(flat)/len(flat)

def steadiness(clip, t, crop=None):
    """Whole-frame movement between neighbouring frames at low resolution."""
    fr = []
    for dt in (0.0, 0.05, 0.10):
        r = _frame(clip, t+dt, w=96, crop=crop)
        if r: fr.append(list(r[0].getdata()))
    if len(fr) < 2:
        return None
    diffs = []
    for i in range(len(fr)-1):
        diffs.append(sum(abs(a-b) for a, b in zip(fr[i], fr[i+1]))/len(fr[i]))
    return sum(diffs)/len(diffs)

def exposure(gray):
    px = sorted(gray.getdata()); n = len(px)
    return {"p50": px[n//2],
            "blown": round(sum(1 for v in px if v >= 252)/n*100, 2)}

def score(clip, t, crop=None):
    r = _frame(clip, t, crop=crop)
    if r is None:
        return None
    gray, _ = r
    sh = sharpness(gray)
    cl = cleanness(gray)
    st = steadiness(clip, t, crop=crop)
    ex = exposure(gray)
    if st is None:
        return None
    # normalise to 0-100. Thresholds come from measuring this footage:
    # sharp dog takes ~30, soft horse takes ~15; still shots ~2, shaky ~9.
    s_sharp = max(0.0, min(1.0, (sh - 12) / 22))
    s_steady = max(0.0, min(1.0, 1 - (st - 1.5) / 8.0))
    s_clean = max(0.0, min(1.0, 1 - (cl - 2.0) / 6.0))
    s_expo = 1.0 - min(1.0, ex["blown"] / 8.0)
    total = 100 * (0.40*s_sharp + 0.35*s_steady + 0.18*s_clean + 0.07*s_expo)
    return {"t": round(t, 2), "sharp": round(sh, 1), "shake": round(st, 2),
            "noise": round(cl, 2), "blown": ex["blown"], "p50": ex["p50"],
            "score": round(total, 1)}

def scan(clip, start, end, step=0.5, crop=None):
    out = []
    t = start
    while t <= end:
        s = score(clip, t, crop=crop)
        if s: out.append(s)
        t += step
    out.sort(key=lambda r: -r["score"])
    return out

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("clip"); a.add_argument("start", type=float)
    a.add_argument("end", type=float)
    a.add_argument("--step", type=float, default=0.5)
    a.add_argument("--top", type=int, default=12)
    a.add_argument("--crop", default=None)
    n = a.parse_args()
    res = scan(n.clip, n.start, n.end, n.step, n.crop)
    print(f"  {'t':>7} {'score':>6} {'sharp':>6} {'shake':>6} {'noise':>6} {'blown':>6}")
    for r in res[:n.top]:
        print(f"  {r['t']:>7} {r['score']:>6} {r['sharp']:>6} "
              f"{r['shake']:>6} {r['noise']:>6} {r['blown']:>6}")
