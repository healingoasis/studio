#!/usr/bin/env python3
"""
Grade one clip: measure it, build a LUT balanced for it, encode 10-bit.

10-bit output is not optional. Graded S-Log3 banding shows up in exactly the
surfaces this footage is full of -- pale walls, concrete floors -- and an 8-bit
encode is the classic amateur tell.
"""
import subprocess, os, sys, argparse, tempfile, json, time
from analyze import measure, FF
from lut import Look, write_cube

# The look Daniel approved on C8181.
LOOK = dict(toe=0.38, con=1.12, sat=1.28, scurve=0.30, split=1.05)

def grade(clip, out, encoder="hw", bitrate="100M", crf=18, seconds=None,
          lut_size=64, verbose=True):
    m = measure(clip, frames=6)
    if m is None:
        return None, "could not read"
    look = Look(toe=LOOK["toe"], contrast=LOOK["con"], saturation=LOOK["sat"],
                scurve=LOOK["scurve"], split=LOOK["split"],
                legal_range=not m["full_range"],
                wb_r=m["wb_r"], wb_b=m["wb_b"])
    with tempfile.TemporaryDirectory() as d:
        cube = os.path.join(d, "g.cube")
        write_cube(cube, look, N=lut_size)
        # 16-bit RGB through the LUT so the grade has headroom, then down to 10-bit
        vf = (f"format=gbrp16le,lut3d='{cube}':interp=tetrahedral,"
              f"format=yuv420p10le")
        cmd = [FF, "-nostdin", "-color_range", "pc", "-i", clip]
        if seconds: cmd += ["-t", str(seconds)]
        cmd += ["-vf", vf]
        if encoder == "hw":
            cmd += ["-c:v", "hevc_videotoolbox", "-profile:v", "main10",
                    "-b:v", bitrate, "-tag:v", "hvc1"]
        else:
            cmd += ["-c:v", "libx265", "-profile:v", "main10",
                    "-crf", str(crf), "-preset", "medium", "-tag:v", "hvc1"]
        cmd += ["-color_range", "tv", "-colorspace", "bt709",
                "-color_primaries", "bt709", "-color_trc", "bt709",
                "-c:a", "copy", "-y", out]
        t0 = time.time()
        r = subprocess.run(cmd, capture_output=True, text=True)
        el = time.time() - t0
    if not os.path.exists(out):
        return m, r.stderr[-600:]
    return m, {"seconds": round(el,1), "size_mb": round(os.path.getsize(out)/1e6,1),
               "wb": [m["wb_r"], m["wb_b"]], "duration": m["duration"]}

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("clip"); a.add_argument("out")
    a.add_argument("--encoder", default="hw", choices=["hw","x265"])
    a.add_argument("--bitrate", default="100M")
    a.add_argument("--crf", type=int, default=18)
    a.add_argument("--t", type=float, default=None)
    n = a.parse_args()
    m, res = grade(n.clip, n.out, encoder=n.encoder, bitrate=n.bitrate,
                   crf=n.crf, seconds=n.t)
    print(json.dumps(res, indent=2) if isinstance(res, dict) else f"FAILED: {res}")
