#!/usr/bin/env python3
"""
Lay keyframes out for review, sized so small objects survive.

The review surface has a display cap around 2000px wide. A 6-across sheet gives
each frame ~330px, at which an acupuncture needle is roughly two pixels and
invisible -- which is exactly how the first search missed them. Three across
gives ~660px per frame, which is the smallest that still shows fine detail.

So: fewer frames per sheet, more sheets. The cost is reading more images; the
benefit is that the answer is actually visible in them.
"""
import os, json, argparse, subprocess

FF = "/Users/danielrivera/studio/tools/ffmpeg"
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

def build(kf_dir, out_dir, cols=3, rows=3, tile_w=660):
    os.makedirs(out_dir, exist_ok=True)
    man = json.load(open(os.path.join(kf_dir, "manifest.json")))
    per = cols * rows
    sheets = []
    for i in range(0, len(man), per):
        chunk = man[i:i+per]
        sheet_no = i // per + 1
        stage = os.path.join(out_dir, f"_s{sheet_no}")
        os.makedirs(stage, exist_ok=True)
        for old in os.listdir(stage):
            os.remove(os.path.join(stage, old))
        for j, e in enumerate(chunk, 1):
            src = os.path.join(kf_dir, e["file"])
            dst = os.path.join(stage, f"{j:02d}.jpg")
            mins, secs = divmod(e["t"], 60)
            label = f"{e['clip']} {int(mins)}:{secs:04.1f}"
            subprocess.run([FF, "-nostdin", "-i", src, "-vf",
                f"scale={tile_w}:-1,drawtext=fontfile='{FONT}':text='{label}':"
                f"x=6:y=5:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.85:"
                f"boxborderw=4", "-frames:v", "1", "-q:v", "3",
                "-update", "1", "-y", dst], capture_output=True)
        out = os.path.join(out_dir, f"sheet_{sheet_no:03d}.jpg")
        subprocess.run([FF, "-nostdin", "-pattern_type", "glob",
                        "-i", os.path.join(stage, "*.jpg"),
                        "-vf", f"tile={cols}x{rows}:margin=4:padding=4:color=#111111",
                        "-frames:v", "1", "-q:v", "3", "-update", "1",
                        "-y", out], capture_output=True)
        for f in os.listdir(stage):
            os.remove(os.path.join(stage, f))
        os.rmdir(stage)
        if os.path.exists(out):
            sheets.append({"sheet": sheet_no, "file": out,
                           "frames": [{"clip": e["clip"], "t": e["t"]} for e in chunk]})
    idx = os.path.join(out_dir, "sheets.json")
    json.dump(sheets, open(idx, "w"), indent=1)
    print(f"  {len(sheets)} sheets, {per} frames each -> {out_dir}")
    return sheets

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("kf_dir"); a.add_argument("out_dir")
    a.add_argument("--cols", type=int, default=3)
    a.add_argument("--rows", type=int, default=3)
    a.add_argument("--tile", type=int, default=660)
    n = a.parse_args()
    build(n.kf_dir, n.out_dir, n.cols, n.rows, n.tile)
