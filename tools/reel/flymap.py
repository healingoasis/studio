#!/usr/bin/env python3
"""Mark every small moving object on a frame, so a fly can be SEEN, not inferred."""
import sys, os, subprocess, tempfile
from PIL import Image, ImageChops, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from certify import specks

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def grab(clip, t, crop, w=900):
    d = tempfile.mkdtemp(); p = os.path.join(d, "f.png")
    subprocess.run([FF, "-nostdin", "-ss", f"{t:.3f}", "-i", clip, "-frames:v", "1",
                    "-vf", f"{crop},scale={w}:-1", "-update", "1", "-y", p],
                   capture_output=True)
    im = Image.open(p); im.load(); os.remove(p); os.rmdir(d)
    return im.convert("RGB")

def map_specks(clip, t, crop, out, w=900, span=1/30.0):
    a = grab(clip, t, crop, w); b = grab(clip, t + span, crop, w)
    ga, gb = a.convert("L"), b.convert("L")
    blobs = specks(ga, gb, thresh=70, max_blob=40)
    d = ImageDraw.Draw(b)
    for x, y, size in blobs:
        d.ellipse([x-14, y-14, x+14, y+14], outline=(255, 60, 60), width=3)
    b.save(out, quality=92)
    return len(blobs), blobs

if __name__ == "__main__":
    clip, t, crop, out = sys.argv[1], float(sys.argv[2]), sys.argv[3], sys.argv[4]
    n, blobs = map_specks(clip, t, crop, out)
    print(f"  {n} moving specks marked -> {out}")
    for x, y, s in blobs[:14]:
        print(f"    at ({x},{y}) size {s}")
