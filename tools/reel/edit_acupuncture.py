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

BIG   = 96
MED   = 78
SMALL = 60
HUGE  = 112
TOPY  = 340          # headline sits high, clear of the caption UI
MIDY  = H//2 - 60

# Every shot is acupuncture. The earlier cut mixed in palpation and manual
# therapy, which is a different modality and does not belong in a film selling
# this programme. Two sessions carry the whole thing: the French bulldog
# (C8192, needles visible 190-232s) and the paint horse (C8188, 30-85s).

# Every shot is acupuncture -- no palpation, no manual therapy, which is a
# different modality and does not belong in a film selling this one.
#
# Two sessions carry it: the French bulldog (C8192, needles 190-240s) and the
# paint horse (C8188, 30-85s). The earlier cut used four near-identical angles
# of the dog's back and read as one long take rather than an edit, so this one
# deliberately alternates scale and subject: extreme close, human face, animal,
# then the patient standing calm.

# All acupuncture. Two sessions: the French bulldog (C8192, needles 190-240s)
# and the paint horse (C8188, 30-85s).
#
# Cut for energy rather than calm: shorter shots up front, a slow push on every
# frame so nothing sits still, type that rises into place with a key line in
# cyan, and the two slow-motion beats saved for the open and the payoff.

EDIT = [
    (shot("C8192", 202.6, 2.2, xoff=0.38, speed=0.55, push=0.07),
     [text("YOUR PATIENT", BIG, TOPY, 0.15, 3.8),
      text("CAN'T TELL YOU", BIG, TOPY+112, 0.45, 3.5),
      text("WHERE IT HURTS.", BIG, TOPY+224, 0.80, 3.2, accent=True)]),

    (shot("C8192", 218.6, 1.9, xoff=0.36, push=0.06),
     [text("SO YOU LEARN", MED, TOPY, 0.08, 1.9),
      text("TO FIND IT.", MED, TOPY+92, 0.26, 1.9, accent=True)]),

    (shot("C8188", 39.2, 1.7, xoff=0.55, push=0.06), []),

    (shot("C8188", 46.6, 1.9, xoff=0.52, push=0.06),
     [text("REAL PATIENTS.", MED, TOPY, 0.1, 1.9),
      text("NOT MODELS.", MED, TOPY+92, 0.28, 1.9, accent=True)]),

    (shot("C8192", 225.4, 1.7, xoff=0.34, push=0.07), []),

    (shot("C8188", 70.5, 2.0, xoff=0.46, push=0.06),
     [text("FIVE MODULES.", MED, TOPY, 0.1, 2.0),
      text("HANDS-ON.", MED, TOPY+92, 0.28, 2.0, accent=True)]),

    (shot("C8188", 76.8, 2.1, xoff=0.50, push=0.06),
     [text("TAUGHT BY DVMs", SMALL, TOPY, 0.1, 2.1),
      text("AND LICENSED", SMALL, TOPY+72, 0.1, 2.1),
      text("ACUPUNCTURISTS", SMALL, TOPY+144, 0.1, 2.1, accent=True)]),

    (shot("C8192", 229.3, 2.9, xoff=0.52, speed=0.60, push=0.05),
     [text("MEDICINE YOU CAN", 72, TOPY, 0.35, 4.6),
      text("USE MONDAY", 72, TOPY+86, 0.5, 4.4),
      text("MORNING.", 72, TOPY+172, 0.65, 4.2, accent=True)]),

    (shot("C8192", 231.4, 1.9, xoff=0.52, push=0.06),
     [text("VETERINARY", 96, TOPY, 0.1, 1.9),
      text("ACUPUNCTURE", 96, TOPY+124, 0.1, 1.9, accent=True)]),

    (shot("C8192", 232.4, 3.3, xoff=0.52, darken=0.32, push=0.04),
     [text("PART I BEGINS", BIG, 420, 0.15, 3.1),
      text("SEPTEMBER 16", BIG, 540, 0.30, 3.0, accent=True),
      text("healingoasis.edu", 62, 690, 0.6, 2.7, font=FONT),
      text("Healing Oasis Wellness Center", 36, 776, 0.6, 2.7, font=FONT,
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
