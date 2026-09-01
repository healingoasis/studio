#!/usr/bin/env python3
"""
Turn a folder of footage into a reviewable set of keyframes.

The problem this solves: finding one specific moment ("where are the needles?")
inside an hour of video. Sampling a few frames at guessed timestamps is a bad
search -- it missed acupuncture needles entirely on the first attempt. Watching
all of it is not affordable either.

So: sample densely, throw away near-duplicates, and lay the survivors out on
contact sheets at a resolution where small objects are actually visible.

A 60-second locked-off shot yields one useful frame, not thirty, and the
de-duplication is what makes the review set small enough to look at properly.
"""
import os, sys, subprocess, argparse, json
from PIL import Image

FF = "/Users/danielrivera/studio/tools/ffmpeg"

def duration(path):
    r = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    for line in r.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            try:
                h, m, s = t.split(":")
                return int(h)*3600 + int(m)*60 + float(s)
            except Exception:
                pass
    return 0.0

def dhash(img, size=8):
    """Difference hash: robust to small changes, catches near-duplicates."""
    g = img.convert("L").resize((size+1, size), Image.LANCZOS)
    px = list(g.getdata())
    bits = 0
    for row in range(size):
        base = row * (size+1)
        for col in range(size):
            bits = (bits << 1) | (1 if px[base+col] > px[base+col+1] else 0)
    return bits

def hamming(a, b):
    return bin(a ^ b).count("1")

def extract(folder, out_dir, every=2.0, width=1100, pattern="_GRADED.mp4",
            dedup_threshold=12, any_video=False):
    """any_video=True walks subfolders and takes every .mp4/.mov, which is what
    the non-acupuncture folders need -- they have no _GRADED naming."""
    os.makedirs(out_dir, exist_ok=True)
    if any_video:
        clips = []
        for root, _, files in os.walk(folder):
            for fn in files:
                if fn.lower().endswith((".mp4", ".mov")) and "_GRADED" not in fn:
                    clips.append(os.path.relpath(os.path.join(root, fn), folder))
        clips.sort()
    else:
        clips = sorted(f for f in os.listdir(folder) if f.endswith(pattern))
    manifest, kept, seen = [], 0, 0
    for ci, name in enumerate(clips, 1):
        path = os.path.join(folder, name)
        dur = duration(path)
        if dur <= 0:
            continue
        label = os.path.splitext(os.path.basename(name))[0].replace(pattern.replace(".mp4",""), "")
        print(f"  [{ci}/{len(clips)}] {label} ({dur:.0f}s)  kept so far: {kept}", flush=True)
        # Seek-based extraction: `-ss` BEFORE `-i` jumps to the nearest keyframe
        # and decodes only from there, so cost is per-sample, not per-frame of
        # the whole clip. Decoding every frame to keep one in sixty was 20x
        # slower, and -skip_frame nokey is ignored by this HEVC.
        prev_hash = None
        t = every / 2.0
        while t < dur:
            tmp = os.path.join(out_dir, f"_tmp_{ci}.jpg")
            subprocess.run([FF, "-nostdin", "-ss", f"{t:.2f}", "-i", path,
                            "-frames:v", "1", "-vf", f"scale={width}:-1",
                            "-q:v", "3", "-update", "1", "-y", tmp],
                           capture_output=True)
            if os.path.exists(tmp):
                seen += 1
                try:
                    im = Image.open(tmp); im.load()
                    h = dhash(im)
                    if prev_hash is None or hamming(h, prev_hash) >= dedup_threshold:
                        fn = f"{label}__{int(t*100):07d}.jpg"
                        im.save(os.path.join(out_dir, fn), quality=88)
                        manifest.append({"clip": label, "t": round(t, 2), "file": fn})
                        prev_hash = h
                        kept += 1
                except Exception:
                    pass
                os.remove(tmp)
            t += every
    with open(os.path.join(out_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    print(f"\n  sampled {seen} frames, kept {kept} after removing near-duplicates")
    print(f"  manifest: {os.path.join(out_dir,'manifest.json')}")
    return manifest

if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("folder"); a.add_argument("out")
    a.add_argument("--every", type=float, default=2.0)
    a.add_argument("--width", type=int, default=1100)
    a.add_argument("--threshold", type=int, default=12)
    a.add_argument("--pattern-any", action="store_true",
                   help="index every .mp4/.mov including subfolders")
    n = a.parse_args()
    extract(n.folder, n.out, every=n.every, width=n.width,
            dedup_threshold=n.threshold, any_video=n.pattern_any)
