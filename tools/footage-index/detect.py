#!/usr/bin/env python3
"""
Decide whether a clip is log footage that needs grading, or ordinary footage
that must be left alone.

This matters because the S-Log3 grade is destructive if misapplied: footage
already converted to Rec.709 would get a second conversion and come out wrong.
The acupuncture shoot is 10-bit 4:2:2 full-range XAVC S-Log3; the CE,
Conference, VSMT and VMRT folders are ordinary 8-bit video and iPhone .MOV.

Two signals, both required for "log":
  - the container/stream looks like it (10-bit, 4:2:2, full range)
  - the picture is actually flat (log footage has low contrast and sits in a
    narrow band around the middle; graded footage does not)
"""
import subprocess, os, sys, json, tempfile, argparse
from PIL import Image

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def stream_info(path):
    r = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    info = {"tenbit": False, "422": False, "full": False, "xavc": False,
            "w": 0, "h": 0}
    for line in r.splitlines():
        if "major_brand" in line and "XAVC" in line:
            info["xavc"] = True
        if "Stream #0:0" in line and "Video:" in line:
            info["tenbit"] = "p10" in line
            info["422"] = "422" in line
            info["full"] = "(pc" in line or "yuvj" in line
            for tok in line.replace(",", " ").split():
                a = tok.split("x")
                if len(a) == 2 and a[0].isdigit() and a[1].isdigit() and int(a[0]) > 300:
                    info["w"], info["h"] = int(a[0]), int(a[1])
    return info

def flatness(path, t=None):
    """Log footage is flat: little of the range is used, and it sits mid-grey."""
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "f.jpg")
        subprocess.run([FF, "-nostdin", "-ss", str(t or 3), "-i", path,
                        "-frames:v", "1", "-vf", "scale=240:-1",
                        "-q:v", "4", "-update", "1", "-y", p],
                       capture_output=True)
        if not os.path.exists(p):
            return None
        px = sorted(Image.open(p).convert("L").getdata())
    n = len(px)
    p5, p50, p95 = px[n//20], px[n//2], px[int(n*0.95)]
    return {"p5": p5, "p50": p50, "p95": p95, "spread": p95 - p5}

def classify(path):
    s = stream_info(path)
    f = flatness(path)
    if f is None:
        return "unreadable", s, f
    # Flat log: narrow range, midtones bunched high-ish. Graded/ordinary video
    # uses far more of the range.
    looks_flat = f["spread"] < 120 and 70 <= f["p50"] <= 170
    looks_log_container = s["tenbit"] and s["422"] and s["full"]
    if looks_log_container and looks_flat:
        return "log", s, f
    if looks_log_container and not looks_flat:
        return "log-container-but-not-flat", s, f
    return "standard", s, f

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("--limit", type=int, default=12)
    n = a.parse_args()
    vids = []
    for root, _, files in os.walk(n.folder):
        for fn in files:
            if fn.lower().endswith((".mp4", ".mov")) and "_GRADED" not in fn:
                vids.append(os.path.join(root, fn))
    vids.sort()
    counts = {}
    for v in vids[:n.limit]:
        c, s, f = classify(v)
        counts[c] = counts.get(c, 0) + 1
        print(f"  {os.path.basename(v):22s} {c:28s} "
              f"{s['w']}x{s['h']} 10bit={s['tenbit']} 422={s['422']} "
              f"full={s['full']}" + (f" spread={f['spread']}" if f else ""))
    print(f"\n  {dict(counts)}  (of {len(vids)} clips total)")
