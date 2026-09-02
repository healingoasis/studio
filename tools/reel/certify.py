#!/usr/bin/env python3
"""
Certify a RUN of footage, frame by frame, instead of sampling single frames.

The hole in the previous method: shots are 1.5-2.5 seconds long, but quality
was measured at one instant. A frame can score 92 at 205.0s while the shot that
ships contains a focus hunt at 205.6 and an insect crossing at 205.9. Sampling
cannot see either.

So: step through a candidate run at 4 frames per second, score every step, and
only accept the run if the WORST frame passes. A run is as good as its weakest
moment, not its best.

Also detects small moving objects -- flies. A fly is a handful of pixels that
changes between consecutive frames, is isolated from other change, and moves.
Camera shake moves everything; a dog breathing moves a large connected region;
an insect is small, high-contrast and erratic. That difference is measurable.
"""
import subprocess, os, sys, tempfile, argparse, json
from PIL import Image, ImageFilter, ImageChops

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def frames(clip, start, dur, fps, crop=None, w=320):
    """Decode a run once and return its frames, rather than seeking per frame."""
    d = tempfile.mkdtemp()
    vf = (crop + ",") if crop else ""
    subprocess.run([FF, "-nostdin", "-ss", f"{start:.3f}", "-i", clip,
                    "-t", f"{dur:.3f}", "-vf", f"{vf}fps={fps},scale={w}:-1",
                    "-q:v", "3", os.path.join(d, "f_%04d.jpg")],
                   capture_output=True)
    out = []
    for fn in sorted(os.listdir(d)):
        p = os.path.join(d, fn)
        im = Image.open(p); im.load()
        out.append(im.convert("L"))
        os.remove(p)
    os.rmdir(d)
    return out

def sharp(g):
    e = g.filter(ImageFilter.FIND_EDGES)
    d = list(e.getdata()); m = sum(d)/len(d)
    return (sum((x-m)**2 for x in d)/len(d)) ** 0.5

def noise(g):
    b = g.filter(ImageFilter.GaussianBlur(2))
    gd, bd = list(g.getdata()), list(b.getdata())
    ed = list(g.filter(ImageFilter.FIND_EDGES).getdata())
    flat = [abs(a-c) for a, c, e in zip(gd, bd, ed) if e < 18]
    return sum(flat)/len(flat) if len(flat) > 200 else 0.0

def move(a, b):
    d = ImageChops.difference(a, b)
    px = list(d.getdata())
    return sum(px)/len(px)

def specks(a, b, thresh=70, max_blob=40):
    """Count small isolated moving blobs -- the signature of an insect.

    Large connected change is the animal or the camera. A fly is a few dozen
    pixels that move independently of everything around them.
    """
    d = ImageChops.difference(a, b)
    w, h = d.size
    px = d.load()
    seen = [[False]*w for _ in range(h)]
    blobs = []
    for y in range(0, h):
        for x in range(0, w):
            if px[x, y] < thresh or seen[y][x]:
                continue
            stack = [(x, y)]; seen[y][x] = True; size = 0
            minx = maxx = x; miny = maxy = y
            while stack and size <= max_blob * 4:
                cx, cy = stack.pop(); size += 1
                minx = min(minx, cx); maxx = max(maxx, cx)
                miny = min(miny, cy); maxy = max(maxy, cy)
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = cx+dx, cy+dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] \
                       and px[nx, ny] >= thresh:
                        seen[ny][nx] = True; stack.append((nx, ny))
            if 3 <= size <= max_blob and (maxx-minx) < 14 and (maxy-miny) < 14:
                blobs.append((minx, miny, size))
    return blobs

def certify(clip, start, dur, crop=None, fps=30, limits=None):
    """fps must be high: shake and insects are only meaningful between ADJACENT
    frames. Sampling at 4fps measured the dog breathing as camera shake and
    counted fur texture as insects."""
    lim = limits or {"sharp": 22.0, "shake": 3.5, "noise": 5.0, "specks": 6}
    fr = frames(clip, start, dur, fps, crop=crop)
    if len(fr) < 2:
        return {"ok": False, "why": "could not decode run"}
    rows = []
    for i, g in enumerate(fr):
        r = {"i": i, "t": round(start + i/fps, 2),
             "sharp": round(sharp(g), 1), "noise": round(noise(g), 2)}
        if i > 0:
            r["shake"] = round(move(fr[i-1], g), 2)
            r["specks"] = len(specks(fr[i-1], g))
        rows.append(r)
    # A cut is a near-total frame change and would register as enormous shake.
    # Verifying a finished edit means ignoring the frame pairs that straddle
    # cuts, or every edit looks catastrophically unstable.
    CUT = 30.0
    body = [r for r in rows if "shake" in r and r["shake"] < CUT]
    cuts = sum(1 for r in rows if r.get("shake", 0) >= CUT)
    if not body:
        return {"ok": False, "why": "no continuous run between cuts",
                "worst": {}, "frames": len(fr), "rows": rows, "cuts": cuts}
    keep = {r["i"] for r in body} | {r["i"]-1 for r in body}
    worst = {
        "sharp": min(r["sharp"] for r in rows if r["i"] in keep),
        "shake": max(r["shake"] for r in body),
        "noise": max(r["noise"] for r in rows if r["i"] in keep),
        "specks": max(r["specks"] for r in body),
    }
    fails = []
    if worst["sharp"] < lim["sharp"]: fails.append(f"soft ({worst['sharp']})")
    if worst["shake"] > lim["shake"]: fails.append(f"shaky ({worst['shake']})")
    if worst["noise"] > lim["noise"]: fails.append(f"noisy ({worst['noise']})")
    if worst["specks"] > lim["specks"]: fails.append(f"insects ({worst['specks']})")
    return {"ok": not fails, "why": "; ".join(fails), "worst": worst,
            "frames": len(fr), "rows": rows, "cuts": cuts}

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("clip"); a.add_argument("start", type=float)
    a.add_argument("dur", type=float)
    a.add_argument("--crop", default=None); a.add_argument("--fps", type=int, default=30)
    a.add_argument("-v", action="store_true")
    n = a.parse_args()
    r = certify(n.clip, n.start, n.dur, crop=n.crop, fps=n.fps)
    print(f"  {'PASS' if r['ok'] else 'FAIL'}  {r.get('why','')}")
    print(f"  worst across {r['frames']} frames: {r['worst']}")
    if n.v:
        for row in r["rows"]:
            print("   ", row)
