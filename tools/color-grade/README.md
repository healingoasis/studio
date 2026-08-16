# Colour grading tool — Sony S-Log3

Grades Sony S-Log3 footage natively on the Mac using AVFoundation and Core Image.
No third-party software, no external LUT files.

```bash
swiftc -O -o analyze analyze.swift
swiftc -O -o slog3   slog3.swift

./analyze frame.jpg                                   # measure before touching anything
./slog3 still in.jpg out.jpg --toe 0.22 --con 1.06 --sat 1.08   # dial the look in (instant)
./slog3 video in.mp4 out.mp4 --toe 0.22 --con 1.06 --sat 1.08   # apply to the whole clip
```

## Daniel's camera settings

4:2:2 10-bit · S-Log3 · normally 4K 60fps (slow-motion clips come in at 1080p120).

## How it works

This is **not** an eyeballed curve. It builds a 64³ 3D LUT from Sony's published maths:

1. **S-Log3 EOTF** — code value → scene linear, using Sony's official formula. Mid grey
   (18%) sits at code 420, 90% white at code 598.
2. **S-Gamut3.Cine → Rec.709** — Sony's published 3x3 primaries matrix.
3. **Reinhard shoulder**, white point 900%, so ceiling lights and bright doorways roll off
   instead of smearing into flat white.
4. **Rec.709 gamma encode** (1/2.4).

Then a creative pass on top, which is the standard two-stage workflow — technical
conversion first, look second:

5. **Shadow toe** (`--toe`) — subtracts most at the bottom of the curve and almost nothing
   by mid grey, so blacks get depth without dragging the midtones down with them.
6. Light **contrast** around a mid-grey pivot and a small **saturation** lift.

The tool prints where the reference tones land every run, so the maths can be checked
rather than trusted:

```
reference: S-Log3 black(95) -> 0,  18% grey(420) -> 117,  90% white(598) -> 189
```

Those numbers are correct for Rec.709. If they drift, something is wrong upstream.

## Options

| Flag | Default | What it does |
|------|---------|--------------|
| `--toe N` | 0 | Shadow depth. 0.22 suits the flat-lit arena. |
| `--con N` | 1.0 | Contrast around mid grey. Keep near 1.05–1.10. |
| `--sat N` | 1.0 | Saturation. The conversion is already accurate, so go easy. |
| `--white N` | 9.0 | Highlight roll-off point, as a multiple of 100% reflectance. |
| `--full` | **required for Daniel's camera** | Input is full range 0–1023 rather than legal 64–940. |

## Targets to aim for

| Measure | Aim for |
|---------|---------|
| p1 | 40–60 (real shadows, no crushing) |
| p50 | 115–135 |
| p95 | 170–190 |
| p99 | 240–255 (light fixtures may clip; that's fine) |

## Check the range tag before anything else

```bash
swiftc -O -o tags tags.swift
./tags source.mp4
```

If it reports `FullRangeVideo: 1`, the clip is **full range** and `--full` is mandatory.
Daniel's camera records full range. Grading a full-range clip as legal range lifts the
shadows and quietly flattens the result — it cost a whole re-export to spot, because the
output still looked plausible on its own. It only showed up when the tags were checked.

## Lesson from the first attempt

The first pass on C8181 was graded by eye — black point, contrast, saturation — before
Daniel said it was S-Log3. It looked punchy but the colour was invented, and steep
contrast on a log signal amplifies whatever colour cast is already there (that version
went orange until the white balance was corrected first).

Knowing the profile removes the guesswork entirely. **Always ask what profile a clip was
shot in before grading it.**

Second lesson: a technically perfect S-Log3 → Rec.709 conversion of a flat-lit white
arena still looks flat, because the scene genuinely has no blacks in it. That is what the
creative pass is for. Correct conversion first, then the look — not one instead of the
other.

## Split-screen proof

`./slog3 split in.mp4 out.mp4 --full ...` renders 15 seconds with the original on the left
and the graded version on the right, labelled, in one file. Use this whenever someone says
"it looks the same" — comparing two files from memory is unreliable, one file is not.

`splitov.py` draws the divider and labels.

## Watch out: duplicate source files

Daniel has a full copy of the camera card at
`Photos:videos/Acupuncture /New folder/` — byte-identical to the originals on the
easystore drive. Three graded versions were rejected as "looks the same" because the file
being opened for comparison was `C8181.MP4` from that folder, i.e. the ungraded original,
which naturally never changed.

**Name graded output so it cannot be confused with the source**, and say plainly which
file to open.

## Jobs

**C8181.MP4** — 2026-08-16. Source on the easystore drive, 1 GB, 71s, 1080p120, S-Log3.
Output: `Photos:videos/Graded/C8181_graded.mp4` — 226 MB, 120fps and audio preserved.
Settings: `--full --toe 0.30 --con 1.14 --sat 1.14` (the "richer" look).
Two earlier attempts were discarded: one graded by eye before the profile was known, and
one that used the correct S-Log3 maths but assumed legal range on a full-range file.

**The easystore drive is NTFS**, which macOS mounts read-only, so nothing can be written
back to it — output goes to the Mac. Writing to that drive directly needs an NTFS driver
installed, which is one for Dan.
