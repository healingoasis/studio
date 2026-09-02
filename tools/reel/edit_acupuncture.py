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

# All acupuncture. Shots chosen for LIGHT as much as content: the 200-230s
# take is in shadow and shows sensor noise, while 255-275s is the same session
# in the bright barn aisle and is markedly cleaner. Grainy takes get stronger
# noise reduction; the opening is cropped tighter to frame out a fly on the
# wall behind the dog.

DARK = "6:4:8:6"     # for the shadowed takes
LITE = "3:2:4:3"     # bright takes need barely any

# All acupuncture, three patients: the French bulldog (C8192), the paint horse
# (C8188) and the Shar Pei (C8190).
#
# Shots chosen on measured sharpness, not just content. The horse session's
# wider frames measure 15-18 on edge energy against 24-33 for the dog takes --
# they are genuinely soft, so only its sharpest window (39-42s, 66s) is used,
# with extra sharpening. The 200-230s dog take is in shadow and gets heavier
# noise reduction; 255-275s is the same session in daylight and needs little.

DARK = "6:4:8:6"
LITE = "3:2:4:3"

# Built from measured scores (shot_scores.json), not from what looked good on
# a contact sheet.
#
# The scan overturned an assumption: the 205-222s window -- which I had been
# avoiding as "the grainy shadowed part" -- is the BEST footage in the folder.
# It measures shake 0.9-2.9 and noise 2.6-3.1, where the daylight section I had
# been favouring measures shake 3-4.3. It is steadier, sharper and cleaner.
#
# Since that window is one continuous framing, variety comes from varying the
# CROP -- tight on the hand, medium on the needles, wide on the dog -- rather
# than from cutting to worse footage. The horse appears once, briefly, from its
# single best frame (score 72.9); everything else scores 80+.

DARK = "5:3:7:5"
LITE = "3:2:4:3"

EDIT = [
    # 205.5 -- score 91.4. Tight on the needle going in. Hook has to land in
    # the first second; the research is blunt that losing half the audience in
    # three seconds is unrecoverable.
    (shot("C8192", 205.0, 2.0, xoff=0.40, speed=0.55, push=0.08,
          tight=0.52, yoff=0.52, denoise=DARK, sharpen=0.75),
     [text("THEY CAN'T TELL YOU", 78, TOPY, 0.12, 3.4),
      text("WHERE IT HURTS.", 78, TOPY+96, 0.42, 3.1, accent=True)]),

    # 219.0 -- score 92.3, the highest in the folder. A row of needles.
    (shot("C8192", 218.6, 1.8, xoff=0.42, push=0.06, tight=0.86,
          denoise=DARK, sharpen=0.65),
     [text("SO YOU LEARN", MED, TOPY, 0.08, 1.8),
      text("TO FIND IT.", MED, TOPY+92, 0.26, 1.8, accent=True)]),

    # the horse, once, from its best measured frame
    (shot("C8188", 39.6, 1.5, xoff=0.54, push=0.06, denoise=LITE,
          sharpen=0.9), []),

    # 213.0 -- score 88.9. Tight, different height in frame.
    (shot("C8192", 212.6, 1.8, xoff=0.44, push=0.07, tight=0.62, yoff=0.44,
          denoise=DARK, sharpen=0.75),
     [text("REAL PATIENTS.", MED, TOPY, 0.1, 1.8),
      text("NOT MODELS.", MED, TOPY+92, 0.28, 1.8, accent=True)]),

    # 210.0 -- score 87.9, wider
    (shot("C8192", 209.6, 1.6, xoff=0.38, push=0.06, tight=1.0,
          denoise=DARK, sharpen=0.6), []),

    # 217.5 -- score 88.9, tight on the hand placing
    (shot("C8192", 217.1, 1.8, xoff=0.46, push=0.07, tight=0.56, yoff=0.48,
          denoise=DARK, sharpen=0.75),
     [text("FIVE MODULES.", MED, TOPY, 0.1, 1.8),
      text("HANDS-ON.", MED, TOPY+92, 0.28, 1.8, accent=True)]),

    # 275.0 -- score 80.1, daylight, the practitioner with the patient
    (shot("C8192", 274.4, 2.0, xoff=0.50, push=0.05, denoise=LITE),
     [text("TAUGHT BY DVMs", SMALL, TOPY, 0.1, 2.0),
      text("AND LICENSED", SMALL, TOPY+72, 0.1, 2.0),
      text("ACUPUNCTURISTS", SMALL, TOPY+144, 0.1, 2.0, accent=True)]),

    # payoff
    (shot("C8192", 273.2, 2.6, xoff=0.50, speed=0.62, push=0.05,
          denoise=LITE),
     [text("MEDICINE YOU CAN", 72, TOPY, 0.3, 4.2),
      text("USE MONDAY", 72, TOPY+86, 0.45, 4.0),
      text("MORNING.", 72, TOPY+172, 0.6, 3.8, accent=True)]),

    # title and end card move to the daylight section: the shadowed frames
    # are too dark to sit type over once darkened further
    (shot("C8192", 276.4, 1.6, xoff=0.50, push=0.06, denoise=LITE),
     [text("VETERINARY", 96, TOPY, 0.08, 1.6),
      text("ACUPUNCTURE", 96, TOPY+124, 0.08, 1.6, accent=True)]),

    (shot("C8192", 277.6, 3.0, xoff=0.50, darken=0.30, push=0.04,
          denoise=LITE),
     [text("PART I BEGINS", BIG, 420, 0.12, 2.8),
      text("SEPTEMBER 16", BIG, 540, 0.26, 2.7, accent=True),
      text("healingoasis.edu", 62, 690, 0.5, 2.4, font=FONT),
      text("Healing Oasis Wellness Center", 36, 776, 0.5, 2.4, font=FONT,
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
