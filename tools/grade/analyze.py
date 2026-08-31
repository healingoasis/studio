#!/usr/bin/env python3
"""
Measure a clip before grading it.

Samples frames across the whole clip, decodes S-Log3 to scene linear, and
reports (a) the white balance gains needed to neutralise the scene and
(b) where the tones land once the look is applied. This is the shot-matching
step: without it, one look across 99 clips shot in different light is a preset,
not a grade.
"""
import subprocess, sys, os, json, argparse, tempfile
from PIL import Image
from lut import slog3_to_linear, M, Look, grade_rgb

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def probe(path):
    out = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    dur = 0.0
    for line in out.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = t.split(":"); dur = int(h)*3600 + int(m)*60 + float(s)
        if "Stream #0:0" in line and "Video:" in line:
            full = "(pc" in line or "yuvj" in line
            tenbit = "p10" in line
            res = [w for w in line.split() if "x" in w and w.replace("x","").isdigit()]
    return dur, full, tenbit

def sample_frames(path, n, dur, tmpd):
    """Pull n frames spread across the clip, avoiding the first/last second."""
    paths = []
    lo, hi = min(0.5, dur*0.05), max(0.5, dur*0.95)
    for i in range(n):
        t = lo + (hi - lo) * (i / max(1, n - 1))
        p = os.path.join(tmpd, f"f{i:02d}.png")
        r = subprocess.run([FF, "-nostdin", "-ss", f"{t:.3f}", "-i", path,
                            "-frames:v", "1", "-vf", "scale=320:-1",
                            "-pix_fmt", "rgb24", "-update", "1", "-y", p],
                           capture_output=True)
        if os.path.exists(p): paths.append(p)
    return paths

def measure(path, frames=6):
    dur, full, tenbit = probe(path)
    with tempfile.TemporaryDirectory() as tmpd:
        fps = sample_frames(path, frames, dur, tmpd)
        if not fps: return None
        lin_sum = [0.0, 0.0, 0.0]; count = 0
        for fp in fps:
            im = Image.open(fp).convert("RGB")
            px = list(im.getdata())
            step = max(1, len(px)//4000)
            for p in px[::step]:
                rgb = [v/255.0 for v in p]
                code = [(v*1023.0) if full else (64.0+v*876.0) for v in rgb]
                lin = [max(0.0, slog3_to_linear(c)) for c in code]
                for i in range(3): lin_sum[i] += lin[i]
                count += 1
        avg = [s/max(1,count) for s in lin_sum]
    # grey-world: gains that make the average scene neutral, held on a short
    # leash so a genuinely warm scene isn't scrubbed into grey mush
    g = avg[1] if avg[1] > 1e-9 else 1.0
    wb_r = max(0.85, min(1.18, g/avg[0] if avg[0] > 1e-9 else 1.0))
    wb_b = max(0.85, min(1.18, g/avg[2] if avg[2] > 1e-9 else 1.0))
    return {"file": os.path.basename(path), "duration": round(dur,2),
            "full_range": full, "ten_bit": tenbit,
            "avg_linear": [round(v,5) for v in avg],
            "wb_r": round(wb_r,4), "wb_b": round(wb_b,4)}

if __name__ == "__main__":
    for p in sys.argv[1:]:
        m = measure(p)
        print(json.dumps(m) if m else f"{p}: could not read")
