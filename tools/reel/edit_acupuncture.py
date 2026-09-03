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

# Every shot below is a CERTIFIED RUN: certify.py stepped through it frame by
# frame at 30fps and its worst frame passed. Nothing here was chosen from a
# single sampled frame, which is how flies and focus hunts got through before.
#
# The insect detector is why the old opening is gone. Measured on small isolated
# moving blobs, the 202-204s region scores 45-49 -- that is Daniel's fly. The
# 218.4s run scores 2. Later in the take the fly has left, so the reel now
# starts after it.
#
# Honest ceiling: the steadiest run in this entire folder measures 3.55 and the
# median is 12.77. A tripod would be under 1.0. This is loose handheld footage
# and no amount of selection makes it locked-off. Selection gets the best of
# what exists; the rest is a note for the next shoot.

DARK = "5:3:7:5"
LITE = "3:2:4:3"

# Framed tight on the patient and the hands, deliberately.
#
# Daniel keeps seeing a fly. Three detection methods failed -- frame differencing,
# blob tracking and a dark-trail composite -- all defeated by the camera moving,
# which makes every edge register as motion. Rather than keep guessing at where
# the insect is, the fix is to remove the space it can be seen in: crop past the
# background so the frame holds the animal, the needles and the hands, and
# nothing else. It is also simply a better-looking film.
#
# Crops stay at 0.72-0.80 of frame height. Tighter than that upscales the 4K
# source enough to visibly soften it, which trades one problem for another.

DARK = "5:3:7:5"
LITE = "3:2:4:3"

EDIT = [
    (shot("C8192", 208.8, 1.9, xoff=0.44, yoff=0.56, tight=0.74, speed=0.55,
          push=0.06, denoise=DARK, sharpen=0.8),
     [text("THEY CAN'T TELL YOU", 78, TOPY, 0.12, 3.2),
      text("WHERE IT HURTS.", 78, TOPY+96, 0.42, 2.9, accent=True)]),

    (shot("C8192", 218.4, 1.8, xoff=0.44, yoff=0.56, tight=0.72,
          push=0.06, denoise=DARK, sharpen=0.8),
     [text("SO YOU LEARN", MED, TOPY, 0.08, 1.8),
      text("TO FIND IT.", MED, TOPY+92, 0.26, 1.8, accent=True)]),

    (shot("C8192", 212.0, 1.7, xoff=0.46, yoff=0.54, tight=0.76,
          push=0.06, denoise=DARK, sharpen=0.8),
     [text("REAL PATIENTS.", MED, TOPY, 0.1, 1.7),
      text("NOT MODELS.", MED, TOPY+92, 0.26, 1.7, accent=True)]),

    (shot("C8192", 215.2, 1.7, xoff=0.44, yoff=0.56, tight=0.74,
          push=0.07, denoise=DARK, sharpen=0.8),
     [text("FIVE MODULES.", MED, TOPY, 0.1, 1.7),
      text("HANDS-ON.", MED, TOPY+92, 0.26, 1.7, accent=True)]),

    (shot("C8192", 274.2, 2.0, xoff=0.44, yoff=0.60, tight=0.80,
          push=0.05, denoise=LITE, sharpen=0.7),
     [text("TAUGHT BY DVMs", SMALL, TOPY, 0.1, 2.0),
      text("AND LICENSED", SMALL, TOPY+72, 0.1, 2.0),
      text("ACUPUNCTURISTS", SMALL, TOPY+144, 0.1, 2.0, accent=True)]),

    (shot("C8192", 283.6, 2.4, xoff=0.44, yoff=0.60, tight=0.80, speed=0.62,
          push=0.05, denoise=LITE, sharpen=0.7),
     [text("MEDICINE YOU CAN", 72, TOPY, 0.3, 3.9),
      text("USE MONDAY", 72, TOPY+86, 0.45, 3.7),
      text("MORNING.", 72, TOPY+172, 0.6, 3.5, accent=True)]),

    (shot("C8192", 275.8, 1.5, xoff=0.44, yoff=0.60, tight=0.80,
          push=0.06, denoise=LITE, sharpen=0.7),
     [text("VETERINARY", 96, TOPY, 0.08, 1.5),
      text("ACUPUNCTURE", 96, TOPY+124, 0.08, 1.5, accent=True)]),

    (shot("C8192", 285.2, 2.8, xoff=0.44, yoff=0.60, tight=0.80, darken=0.30,
          push=0.04, denoise=LITE, sharpen=0.7),
     [text("PART I BEGINS", BIG, 420, 0.12, 2.6),
      text("SEPTEMBER 16", BIG, 540, 0.26, 2.5, accent=True),
      text("healingoasis.edu", 62, 690, 0.5, 2.2, font=FONT),
      text("Healing Oasis Wellness Center", 36, 776, 0.5, 2.2, font=FONT,
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
