# Grading pipeline (ffmpeg-based)

Replaces `tools/color-grade/*.swift`, which no longer compiles — the Command Line
Tools on this Mac are behind macOS 26 (`unable to load standard library for target
arm64-apple-macosx26.0`). The maths is ported verbatim from `slog3.swift`, so the
look Daniel approved on C8181 carries forward.

**Port verified against the reference tones**: neutral conversion gives
`black(95) -> 0, 18% grey(420) -> 117, 90% white(598) -> 188`, against the Swift
tool's 0 / 117 / 189. One point of rounding.

- `lut.py` — builds a .cube 3D LUT from Sony's published S-Log3 / S-Gamut3.Cine maths
  plus the creative pass (toe, contrast, s-curve, split tone, tapered saturation).
- `analyze.py` — measures a clip before grading: range flag, bit depth, and the
  white balance gains needed to neutralise it. Gains are clamped to 0.85–1.18 so a
  genuinely warm scene is not scrubbed into grey mush.
- `preview.py` — one image, original left / graded right, for judging the look
  before committing to an encode.

Approved look: `--toe 0.38 --con 1.12 --sat 1.28 --scurve 0.30 --split 1.05`

## The folder

`Photos:videos/Acupuncture /New folder` — 455 files, 105 GB:
99 videos (63 min, 91 of them 4K 10-bit 4:2:2) and 355 Sony ARW stills.
**All clips measured so far report full range**, so `--full` is right, as the
earlier notes insisted.

## Constraint that shapes everything

The Mac has ~22 GB free and the folder is 105 GB. There is no room to grade the
folder as a sweep, and no room to hold originals in the Trash — Trash does not
free space. Work one clip at a time; space opens up as it goes, since graded
output runs roughly a third the size of the camera originals.

The easystore drive was not connected when this was written, so the claim in
`../color-grade/README.md` that it holds byte-identical originals is UNVERIFIED.
Verify it before deleting anything.


## Result, 2026-08-31

All 454 files graded, zero failures. 105 GB -> 44 GB.
Two casualties from settings corrected mid-run: C8185 too dark, C8181 oversized.
