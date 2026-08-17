# C8181 — what a professional edit changed

**Result:** `Photos:videos/Graded/C8181 EDITED - 30 seconds.mp4` — 1920x1080, 30fps, 29.6s.
Built with `edit.swift` from the graded master.

## Second pass (2026-08-17)

Daniel asked for more from both the grade and the cut. What changed:

**Grade — from accurate to actually having a look:**
- **Split toning.** Cool pushed into the shadows, warm into the highlights. This arena is
  one flat warm colour family — sand, pale walls, pine trusses — so there is no natural
  colour contrast in the frame at all. Split toning manufactures it. This is the single
  biggest change and the reason the coat and the teal lead rope now read as separate
  colours instead of one beige wash.
- **Filmic S-curve** on top of the tone map, firming the mids without crushing the ends.
- **Saturation tapered off in the highlights**, so the blown doorway and the ceiling
  fixtures stay clean white instead of picking up a tint as saturation rises.
- Deeper toe (0.38) and stronger saturation (1.28).
- Settings: `--full --toe 0.38 --con 1.12 --sat 1.28 --scurve 0.30 --split 1.05`

**Cut — better shots and a speed ramp:**
- Found stronger material in the 33–43s range that the first pass missed: the horse walking
  toward the lens, and a properly layered composition with the handler in the foreground and
  the assessment happening behind him. Depth in frame is worth more than any effect.
- **A speed ramp**: shot 3 runs at real time for 0.6s then drops into 3x slow motion,
  continuous through the same action. Ramping into slow motion reads as deliberate; cutting
  straight to it reads as a setting.
- **A vignette across the whole film.** The arena is an enormous, evenly lit white box, so
  the frame had no shaping at all. Darkening the corners pulls the eye to the horse.
- Ten shots instead of eight; 29.6s from 19.9s of rushes.

**71 seconds of rushes became 27.5 seconds of film, using 18.5 seconds of the original.**
Roughly three quarters of what the camera recorded is not in the cut.

## Third pass — sharpness (2026-08-17)

Daniel asked whether it could be crisper. Three real causes, two of them fixable:

1. **No sharpening was being applied at all.** The grade is a 3D colour LUT, and a LUT
   cannot sharpen — it only maps colour to colour. So the whole pipeline had zero capture
   sharpening in it. Added a finishing pass: light noise reduction, then unsharp mask
   (radius 1.1, amount 0.55).
2. **The export was only 10 Mbps.** `AVAssetExportPresetHighestQuality` gives roughly that
   for 1080p30, which is not enough for a frame full of sand grain. `finish.swift` replaces
   the export session with `AVAssetReader` → `AVAssetWriter` and a real bitrate. Now **39 Mbps**.
3. **The punch-ins were upscaling.** Cropping into a 1080p frame at 1.45x and blowing it
   back up to 1080p costs detail. Eased the biggest punches back to 1.34x.

**Order matters: sharpen last**, after the punch-ins. Sharpening before a scale-up smears
the halos. That is why the graded master is deliberately left unsharpened — it is an
intermediate, not a delivery.

```bash
swiftc -O -o finish finish.swift
./finish video edit.mp4 final.mp4 --nr 0.008 --radius 1.1 --amount 0.55 --mbps 40
```

**The remaining ceiling is the camera.** The source is 1920x1080. No amount of processing
invents detail that was never recorded. Shooting the next one in 4K would raise this
ceiling more than every trick above combined — and would also make punch-ins free, since a
1.5x crop of 4K is still well over 1080p.

## The five things that did the work

### 1. The 120fps was the whole point, and it was going to waste

The clip was shot at 120fps. That is not a "smoother video" setting — it exists so the
footage can be **slowed down**. Played back as recorded, all that extra information is
thrown away.

Three shots are conformed to slow motion: first contact at 3x, the hands along the back at
2x, the horse settling at 3x. Because the source is 120fps and the timeline is 30fps, 4x is
mathematically perfect — every output frame is a real captured frame. Nothing is invented,
nothing stutters.

### 2. Cutting out the waiting

The rushes contain about 25 seconds of standing around between 13s and 40s while nothing
happens. A pro cuts that without sentiment. What is left is: the horse arrives, the doctor
approaches, hands go on, the horse settles, he turns away. Beginning, middle, end.

### 3. Manufactured coverage from a single camera

There is only one camera and one angle, so there is no coverage to cut between — the usual
problem with documentary footage. The fix is punching into the 1080p frame at different
amounts and positions to create wide, medium and close versions of the same take:

| Shot | Punch | Effect |
|------|-------|--------|
| 1 | 1.00x | Full wide — establishes the arena |
| 2 | 1.15x | Slight push as he walks in |
| 3 | 1.30x | Medium — first contact |
| 4 | 1.45x | Close — hands on the back |
| 5 | 1.00x | Back to wide, to breathe |
| 6 | 1.40x | Close — the horse settles |
| 7 | 1.20x | Medium — he turns, done |

Punch is capped at 1.45x. Past that a 1080p frame goes visibly soft.

The shot sizes also *escalate* — wide, then progressively tighter, then a wide to reset,
then tight again. That rhythm is what makes it feel edited rather than trimmed.

### 4. The grade, applied once, at the top

Graded master first, then cut from it. One conversion, consistent across every shot.

### 5. Opening and closing properly

Fade up from black rather than snapping on. A restrained lower-left title that fades in at
1.6s and out by 5.4s. An end card on the school's mark. Nothing moves that does not need to.

## What is still missing, honestly

- **Music.** This is silent on purpose. The original audio is room noise, and slowed
  footage has no usable sound anyway. A real edit would be scored, and the cut points would
  then be moved to land on the beat. Add licensed music and this improves again.
- **Real coverage.** Punch-ins are a rescue, not a substitute. Two cameras, or one camera
  that moves between takes for a close-up of the hands and a shot of the handler's face,
  and this becomes a genuinely good short film instead of a well-rescued one.
- **A stabilised frame.** The camera drifts. Nothing here fixes that.

## The lesson for filming

The single most valuable change on the next shoot costs nothing: **stop and get close-ups**.
Ten seconds of hands. Ten seconds of the horse's eye. Ten seconds of the handler watching.
Those three shots would have doubled what this edit could do.
