#!/usr/bin/env python3
"""
Reveal an insect by its trail.

Detecting a fly frame-to-frame failed: hair edges and vibrating needles produce
the same signature. But a dark object crossing a lighter background over half a
second leaves a path. Take N consecutive frames and keep the DARKEST value at
each pixel: static background stays as it is, and anything dark that moved is
painted along its whole route. A fly becomes a dotted line.
"""
import sys, os, subprocess, tempfile
from PIL import Image, ImageChops

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def trail(clip, start, dur, crop, out, w=900, fps=30):
    d = tempfile.mkdtemp()
    subprocess.run([FF, "-nostdin", "-ss", f"{start:.3f}", "-i", clip,
                    "-t", f"{dur:.3f}", "-vf", f"{crop},fps={fps},scale={w}:-1",
                    "-q:v", "2", os.path.join(d, "f_%03d.jpg")],
                   capture_output=True)
    files = sorted(os.listdir(d))
    if not files:
        return None
    base = Image.open(os.path.join(d, files[0])).convert("L")
    mn = base.copy()
    for fn in files[1:]:
        im = Image.open(os.path.join(d, fn)).convert("L")
        mn = ImageChops.darker(mn, im)
    # difference between the first frame and the darkest-of-all composite:
    # anything bright here is something dark that passed through
    diff = ImageChops.difference(base, mn)
    diff = diff.point(lambda v: 255 if v > 38 else 0)
    rgb = Image.open(os.path.join(d, files[0])).convert("RGB")
    red = Image.new("RGB", rgb.size, (255, 40, 40))
    rgb.paste(red, (0, 0), diff.convert("L"))
    rgb.save(out, quality=92)
    px = list(diff.getdata())
    marked = sum(1 for v in px if v > 0)
    for fn in files:
        os.remove(os.path.join(d, fn))
    os.rmdir(d)
    return marked, len(files)

if __name__ == "__main__":
    clip, start, dur, crop, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4], sys.argv[5]
    r = trail(clip, start, dur, crop, out)
    print(f"  {r[0]} pixels touched by something dark across {r[1]} frames -> {out}")
