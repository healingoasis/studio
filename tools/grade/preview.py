#!/usr/bin/env python3
"""Before/after stills from a clip, so the look can be judged before any encode."""
import subprocess, os, sys, tempfile, argparse
from analyze import measure, FF
from lut import Look, write_cube

def preview(clip, out, t=None, toe=0.38, con=1.12, sat=1.28, scurve=0.30, split=1.05):
    m = measure(clip, frames=4)
    if t is None: t = m["duration"] * 0.45
    look = Look(toe=toe, contrast=con, saturation=sat, scurve=scurve, split=split,
                legal_range=not m["full_range"], wb_r=m["wb_r"], wb_b=m["wb_b"])
    with tempfile.TemporaryDirectory() as d:
        cube = os.path.join(d, "g.cube")
        write_cube(cube, look, N=33)
        # left = untouched original, right = graded, one file so comparison is real
        vf = (f"[0:v]scale=960:-1,drawtext=text='ORIGINAL (S-Log3)':x=20:y=20:"
              f"fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8[l];"
              f"[1:v]lut3d='{cube}',scale=960:-1,drawtext=text='GRADED':x=20:y=20:"
              f"fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8[r];"
              f"[l][r]hstack=inputs=2")
        subprocess.run([FF, "-nostdin", "-ss", f"{t:.2f}", "-i", clip,
                        "-ss", f"{t:.2f}", "-i", clip,
                        "-filter_complex", vf, "-frames:v", "1",
                        "-q:v", "2", "-update", "1", "-y", out],
                       capture_output=True)
    return m, os.path.exists(out)

if __name__ == "__main__":
    a = argparse.ArgumentParser(); a.add_argument("clip"); a.add_argument("out")
    a.add_argument("--t", type=float, default=None)
    n = a.parse_args()
    m, ok = preview(n.clip, n.out, t=n.t)
    print(f"{m['file']}  {m['duration']}s  full={m['full_range']} 10bit={m['ten_bit']}  "
          f"wb {m['wb_r']}/{m['wb_b']}  ->  {'ok' if ok else 'FAILED'}")
