#!/usr/bin/env python3
"""
The edit. Structure borrowed from what actually works on these platforms:

- A question in the first second that the target viewer cannot answer, so they
  stay to find out. Not a logo, not a wide establishing shot.
- Text carries every claim, because most people watch with sound off.
- Slow motion exactly twice. Used everywhere it emphasises nothing.
- One call to action, with a date, because "learn more" converts nothing.
"""
import os, sys, subprocess, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_reel import (build_shot, concat, shot, text, FF, W, H,
                        FONT, FONT_BLACK, SAFE_BOT)

BIG   = 84
MED   = 68
SMALL = 52
TOPY  = 340          # headline sits high, clear of the caption UI
MIDY  = H//2 - 60

EDIT = [
    # --- hook: the thing itself, in the first second ---------------------
    # Found via tools/footage-index. The first cut opened on palpation because
    # a bad search concluded there was no needling in the folder; there is over
    # two minutes of it in C8192, and it is a far stronger opening.
    (shot("C8192", 203.4, 2.6, xoff=0.44, speed=0.60),
     [text("Your patient", BIG, TOPY, 0.15, 4.2),
      text("can't tell you", BIG, TOPY+100, 0.45, 3.9),
      text("where it hurts.", BIG, TOPY+200, 0.80, 3.5)]),

    (shot("C8192", 213.8, 2.2, xoff=0.44),
     [text("So you learn", MED, TOPY, 0.1, 2.2),
      text("to find it.", MED, TOPY+86, 0.28, 2.2)]),

    (shot("C8253", 5.2, 1.8, xoff=0.50), []),
    (shot("C8225", 11.5, 2.0, xoff=0.55), []),

    # --- the programme, stated plainly -----------------------------------
    (shot("C8194", 12.0, 2.0, xoff=0.55),
     [text("Five modules.", MED, TOPY, 0.15, 2)]),

    (shot("C8262", 22.0, 2.4, xoff=0.50),
     [text("Hands-on practicums", MED, TOPY, 0.15, 2.4),
      text("with live patients.", MED, TOPY+86, 0.35, 2.2)]),

    (shot("C8192", 229.0, 2.2, xoff=0.44), []),

    (shot("C8225", 16.5, 2.4, xoff=0.55),
     [text("Taught by veterinarians", SMALL, TOPY, 0.1, 2.4),
      text("and licensed acupuncturists.", SMALL, TOPY+68, 0.1, 2.4)]),

    (shot("C8276", 6.0, 1.8, xoff=0.50), []),

    # --- the payoff: the animal, settled ---------------------------------
    (shot("C8191", 30.2, 2.7, xoff=0.58, speed=0.60),
     [text("Medicine you can use", MED, TOPY, 0.35, 4.4),
      text("Monday morning.", MED, TOPY+86, 0.62, 4.1)]),

    (shot("C8266", 8.0, 2.2, xoff=0.50),
     [text("VETERINARY", 62, TOPY, 0.1, 2.2, font=FONT_BLACK),
      text("ACUPUNCTURE", 62, TOPY+76, 0.1, 2.2, font=FONT_BLACK)]),

    # --- one call to action, with a date ---------------------------------
    (shot("C8280", 1.2, 3.4, xoff=0.50, darken=0.42),
     [text("VETERINARY ACUPUNCTURE", 44, MIDY-250, 0.1, 3.4, font=FONT_BLACK),
      text("Part I begins", BIG, MIDY-120, 0.25, 3.2, font=FONT_BLACK),
      text("September 16", BIG, MIDY-20, 0.25, 3.2, font=FONT_BLACK),
      text("healingoasis.edu", 60, MIDY+130, 0.7, 2.7),
      text("Healing Oasis Wellness Center", 38, MIDY+215, 0.7, 2.7,
           color="white@0.72")]),
]

def main():
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out_dir, exist_ok=True)
    tmp = tempfile.mkdtemp()
    parts, total = [], 0.0
    for i, (s, txts) in enumerate(EDIT, 1):
        p = os.path.join(tmp, f"{i:02d}.mp4")
        eff = s["dur"] / s["speed"] if s["speed"] != 1.0 else s["dur"]
        print(f"  [{i:2d}/{len(EDIT)}] {s['clip']} {eff:.1f}s", flush=True)
        if build_shot(s, txts, p, i):
            parts.append(p); total += eff
    out = os.path.join(out_dir, "acupuncture-reel.mp4")
    print(f"\n  joining {len(parts)} shots, {total:.1f}s ...")
    if concat(parts, out):
        mb = os.path.getsize(out) / 1e6
        print(f"  wrote {out} ({mb:.1f} MB)")
    else:
        print("  concat failed")

if __name__ == "__main__":
    main()
