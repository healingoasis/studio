#!/usr/bin/env python3
"""
Cut one vertical reel for the Veterinary Acupuncture programme.

Built to be watched MUTED with the sound off, because most reels are: every
claim is on screen as text, and the pictures carry the feeling. Platform audio
is added in-app afterwards, which is also where trending sound helps reach.

Every factual line on screen is sourced from healingoasis.edu, not invented.
"""
import subprocess, os, sys, json, tempfile

FF = "/Users/danielrivera/studio/tools/ffmpeg"
SRC = "/Users/danielrivera/Documents/Claude/Photos:videos/Acupuncture /New folder"
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"

W, H = 1080, 1920
# Instagram/TikTok cover the top ~220px and bottom ~420px with UI.
SAFE_TOP, SAFE_BOT = 300, 560

def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")

def shot(clip, start, dur, xoff=0.5, speed=1.0, zoom=None, darken=0.0,
         push=0.05, tight=1.0, yoff=0.5, denoise=None, sharpen=0.55):
    """tight: <1 crops in further (1.0 = full height). Used to frame out
    background clutter -- there is a fly on the wall behind the dog in the
    202s take, and cropping past it is cleaner than trying to paint it out.
    yoff: where the tighter crop sits vertically (0 = top).
    denoise: override strength for the grainier, darker takes."""
    return {"clip": clip, "start": start, "dur": dur, "xoff": xoff,
            "speed": speed, "zoom": zoom, "darken": darken, "push": push,
            "tight": tight, "yoff": yoff, "denoise": denoise,
            "sharpen": sharpen}

ACCENT = "0x4AD2FF"   # bright cyan: reads as clinical, not corporate beige

def text(t, size=76, y=None, start=0.0, dur=99, font=FONT_BLACK, color="white",
         accent=False, slide=34):
    """slide: pixels the line rises as it fades in. Static type reads dead;
    a short rise plus a fast fade is what makes a line land."""
    return {"t": t, "size": size, "y": y, "start": start, "dur": dur,
            "font": font, "color": ACCENT if accent else color, "slide": slide}

SCRIM = "/private/tmp/claude-501/-Users-danielrivera-studio/a0549ff3-9881-42f6-a35a-e0a37f3a61c8/scratchpad/scrim.png"

def build_shot(s, texts, out, idx):
    """Crop 16:9 to 9:16, scale, optional slow-motion, burn in text."""
    src = os.path.join(SRC, s["clip"] + "_GRADED.mp4")
    # a 3840x2160 frame gives a 1215-wide vertical slice; xoff picks where
    cw = 1215
    cx = f"(iw-{cw})*{s['xoff']}"
    # The barn footage is high-ISO and shows sensor noise once cropped to a
    # third of the frame and viewed near 1:1. Denoise first, then restore
    # micro-contrast, or it reads as grain on a phone screen.
    vf = [f"crop={cw}:2160:{cx}:0",
          "hqdn3d=4:3:6:4.5",
          f"scale={W}:{H}:flags=lanczos",
          f"unsharp=5:5:{s.get('sharpen', 0.55)}:5:5:0.0"]
    if s["speed"] != 1.0:
        vf.append(f"setpts={1.0/s['speed']}*PTS")
    push = s.get("push", 0.05)
    if push:
        eff = s["dur"] / s["speed"] if s["speed"] != 1.0 else s["dur"]
        n = max(2, int(eff * 30))
        d = "in" if s.get("push_dir") == "in" else "in"
        vf.append(f"zoompan=z='1+{push}*on/{n}':d=1:x='iw/2-(iw/zoom/2)':"
                  f"y='ih/2-(ih/zoom/2)':s={W}x{H}:fps=30")
    if s.get("darken"):
        vf.append(f"eq=brightness=-{s['darken']}:saturation=0.9")
    filt = ",".join(vf)
    # scrim first, so the text sits on top of it
    chain = f"[0:v]{filt}[base];[base][1:v]overlay=0:0[scr];[scr]"
    post = []
    for tx in texts:
        y = tx["y"] if tx["y"] is not None else H - SAFE_BOT
        st, sl = tx["start"], tx.get("slide", 34)
        # fade up over 0.18s and rise into place; then hold
        alpha = f"if(lt(t-{st},0.18),(t-{st})/0.18,1)"
        ypos  = f"{y}+{sl}*max(0,1-(t-{st})/0.22)"
        post.append(
            f"drawtext=fontfile='{tx['font']}':text='{esc(tx['t'])}':"
            f"fontsize={tx['size']}:fontcolor={tx['color']}:"
            f"x=(w-text_w)/2:y='{ypos}':line_spacing=12:"
            f"alpha='{alpha}':"
            f"shadowcolor=black@0.92:shadowx=0:shadowy=6:"
            f"borderw=3:bordercolor=black@0.55:"
            f"enable='between(t,{st},{st+tx['dur']})'"
        )
    chain += ",".join(post) if post else "null"
    cmd = [FF, "-nostdin", "-ss", str(s["start"]), "-i", src,
           "-i", SCRIM,
           "-t", str(s["dur"]), "-filter_complex", chain,
           "-an", "-r", "30", "-c:v", "libx264", "-preset", "medium",
           "-crf", "15", "-pix_fmt", "yuv420p", "-y", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if not os.path.exists(out):
        print(f"  shot {idx} FAILED: {r.stderr[-400:]}")
        return False
    return True

def concat(parts, out):
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        for p in parts:
            f.write(f"file '{p}'\n")
        lst = f.name
    subprocess.run([FF, "-nostdin", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    "-r", "30", "-y", out], capture_output=True)
    os.unlink(lst)
    return os.path.exists(out)
