#!/usr/bin/env python3
"""
Grade flat 8-bit footage -- the CE material, not the S-Log3 acupuncture shoot.

These clips are NOT log. Putting them through the S-Log3 conversion would apply
a second colour transform to footage already in Rec.709 and wreck it. What they
actually are is hazy: contrast spread measures 38-75 where healthy footage sits
near 190, so the picture uses barely a third of the available range.

The fix is auto-levels done properly: measure where this clip's black, midtone
and white actually sit, then stretch them onto sensible targets. Adaptive per
clip, because the haze varies a lot between them.

8-bit has little headroom, so the curve is deliberately gentle -- pushing hard
on 8-bit footage bands the sky and blocks the shadows.
"""
import subprocess, os, sys, json, tempfile, argparse
from PIL import Image

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def probe(path):
    r = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    dur, w, h, fps = 0.0, 1920, 1080, 30.0
    import re
    for line in r.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            try:
                hh, mm, ss = t.split(":"); dur = int(hh)*3600 + int(mm)*60 + float(ss)
            except Exception: pass
        if "Stream #0:0" in line and "Video:" in line:
            for tok in line.replace(",", " ").split():
                a = tok.split("x")
                if len(a) == 2 and a[0].isdigit() and a[1].isdigit() and int(a[0]) > 300:
                    w, h = int(a[0]), int(a[1])
            m = re.search(r"([0-9.]+) fps", line)
            if m: fps = float(m.group(1))
    return dur, w, h, fps

def levels(path, dur, samples=5):
    """Where this clip's black, midtone and white actually sit."""
    vals = []
    with tempfile.TemporaryDirectory() as d:
        for i in range(samples):
            t = dur * (0.12 + 0.72 * i / max(1, samples - 1))
            p = os.path.join(d, f"s{i}.jpg")
            subprocess.run([FF, "-nostdin", "-ss", f"{t:.2f}", "-i", path,
                            "-frames:v", "1", "-vf", "scale=320:-1", "-q:v", "4",
                            "-update", "1", "-y", p], capture_output=True)
            if os.path.exists(p):
                vals += list(Image.open(p).convert("L").getdata())
    if not vals: return None
    vals.sort(); n = len(vals)
    return {"p2": vals[int(n*0.02)], "p50": vals[n//2], "p98": vals[int(n*0.98)]}

def curve_for(lv):
    """Stretch measured black/mid/white onto targets, gently."""
    lo = max(0, lv["p2"] - 6) / 255.0
    mid = lv["p50"] / 255.0
    hi = min(255, lv["p98"] + 6) / 255.0
    if hi - lo < 0.12:            # pathological; leave it alone
        return None
    # targets: real black, a midtone with some weight, near-white highlights
    t_lo, t_mid, t_hi = 0.02, 0.46, 0.95
    pts = f"0/0 {lo:.3f}/{t_lo:.3f} {mid:.3f}/{t_mid:.3f} {hi:.3f}/{t_hi:.3f} 1/1"
    return pts

def target_bitrate(w, h, fps):
    mbps = 0.16 * (w * h * fps) / 1e6
    return f"{int(max(10, min(60, round(mbps))))}M"

def grade(src, out, sat=1.16):
    dur, w, h, fps = probe(src)
    if dur <= 0: return None, "unreadable"
    lv = levels(src, dur)
    if not lv: return None, "could not measure"
    pts = curve_for(lv)
    if pts is None: return None, "no usable range"
    vf = (f"curves=all='{pts}',eq=saturation={sat}:contrast=1.04,"
          f"hqdn3d=2:1.5:3:2.5,unsharp=5:5:0.3:5:5:0.0")
    br = target_bitrate(w, h, fps)
    cmd = [FF, "-nostdin", "-i", src, "-vf", vf,
           "-c:v", "hevc_videotoolbox", "-profile:v", "main", "-b:v", br,
           "-tag:v", "hvc1", "-c:a", "copy", "-y", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if not os.path.exists(out):
        return None, r.stderr[-300:]
    return {"levels": lv, "bitrate": br, "dur": round(dur, 2),
            "size_mb": round(os.path.getsize(out)/1e6, 1)}, None

if __name__ == "__main__":
    a = argparse.ArgumentParser(); a.add_argument("src"); a.add_argument("out")
    n = a.parse_args()
    res, err = grade(n.src, n.out)
    print(json.dumps(res, indent=1) if res else f"FAILED: {err}")
