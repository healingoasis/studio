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

EDIT = [
    # --- hook: a needle going in, big enough to read instantly ------------
    (shot("C8192", 202.6, 2.4, xoff=0.38, speed=0.55),
     [text("Your patient", BIG, TOPY, 0.2, 4.0),
      text("can't tell you", BIG, TOPY+100, 0.5, 3.7),
      text("where it hurts.", BIG, TOPY+200, 0.85, 3.3)]),

    # --- pull back: they are already in ----------------------------------
    (shot("C8192", 218.6, 2.1, xoff=0.36),
     [text("So you learn", MED, TOPY, 0.1, 2.1),
      text("to find it.", MED, TOPY+86, 0.28, 2.1)]),

    # --- a person, so it is not just hands and animals --------------------
    (shot("C8188", 39.2, 2.2, xoff=0.55), []),

    # --- same medicine, 500kg patient ------------------------------------
    (shot("C8188", 46.6, 2.1, xoff=0.52),
     [text("Five modules.", MED, TOPY, 0.15, 2.1)]),

    (shot("C8192", 225.4, 2.0, xoff=0.34), []),

    (shot("C8188", 70.5, 2.3, xoff=0.46),
     [text("Hands-on practicums", MED, TOPY, 0.15, 2.3),
      text("with live patients.", MED, TOPY+86, 0.35, 2.1)]),

    (shot("C8188", 76.8, 2.3, xoff=0.50),
     [text("Taught by veterinarians", SMALL, TOPY, 0.1, 2.3),
      text("and licensed acupuncturists.", SMALL, TOPY+68, 0.1, 2.3)]),

    # --- the payoff: the patient, standing calm, entirely unbothered ------
    # The hero frame: dog in profile, needles visible along the back, and the
    # practitioner's face looking down at it. Cute, clinical and warm at once.
    (shot("C8192", 229.3, 3.0, xoff=0.52, speed=0.60),
     [text("Medicine you can use", MED, TOPY, 0.4, 4.8),
      text("Monday morning.", MED, TOPY+86, 0.68, 4.5)]),

    (shot("C8192", 231.4, 2.1, xoff=0.52),
     [text("VETERINARY", 62, TOPY, 0.15, 2.1, font=FONT_BLACK),
      text("ACUPUNCTURE", 62, TOPY+76, 0.15, 2.1, font=FONT_BLACK)]),

    (shot("C8192", 232.4, 3.4, xoff=0.52, darken=0.32),
     # Text sits high, clear of the practitioner's shirt logo -- it was
     # reading through the type and making the card look busy.
     [text("Part I begins", BIG, 430, 0.2, 3.2, font=FONT_BLACK),
      text("September 16", BIG, 530, 0.2, 3.2, font=FONT_BLACK),
      text("healingoasis.edu", 58, 680, 0.6, 2.8),
      text("Healing Oasis Wellness Center", 36, 760, 0.6, 2.8,
           color="white@0.70")]),
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
