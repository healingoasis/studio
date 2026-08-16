# Colour grading tool

Two small Swift programs for grading flat / log-profile footage natively on the Mac.
No third-party software needed — this uses AVFoundation and Core Image.

```bash
swiftc -O -o analyze analyze.swift
swiftc -O -o grade   grade.swift

./analyze frame.jpg                 # per-channel percentiles, to see what the footage needs
./grade still in.jpg  out.jpg       # dial the look in on a still first (fast)
./grade video in.mp4  out.mp4       # apply it to the whole clip
```

Always measure before grading. `analyze` prints p1 / p5 / p50 / p95 / p99 per channel.
Flat footage shows up immediately: lifted blacks (p1 up around 70–80 instead of near 0)
and a squashed range (p95 only around 150).

## The grade, in order

1. **White balance first.** A steep tone curve multiplies any existing colour cast, so
   neutralise it *before* the curve, not after. Measured midtones here ran R 127 / G 122 /
   B 117, corrected with a colour matrix.
2. **Tone curve.** Sets the black point, re-expands contrast, and rolls the highlights off
   with a shoulder so ceiling lights and doorways don't clip to pure white.
3. **A whisper of temperature.** Almost nothing — these interiors already lean warm.
4. **Vibrance, then saturation.** Vibrance first because it protects skin tones; the global
   saturation lift afterwards is small, since the curve itself adds apparent saturation.
5. **Light unsharp mask.** Log footage is soft. Modest, not crunchy.

## Targets to aim for

| Measure | Aim for | Why |
|---------|---------|-----|
| p1 | 10–18 | A real black point, without crushing shadow detail to zero |
| p50 | 105–125 | Midtones sitting where the eye expects them |
| p95 | 175–205 | Bright, with room left above |
| p99 | 235–250 | Specular highlights near the top but not smeared at 255 |
| R/G/B spread at p50 | within ~15 | Wider than that and the image reads as colour-cast |

## First job: C8181.MP4 (2026-08-16)

Source on the easystore drive, 1 GB, 71s, 1080p at 120fps, flat profile.
Graded output: `Photos:videos/Graded/C8181_graded.mp4` — 226 MB, 120fps and audio preserved.

**The easystore drive is NTFS**, which macOS mounts read-only, so nothing can be written
back to it. Output goes to the Mac instead. If Daniel wants to write to that drive
directly, that needs an NTFS driver installed — one for Dan.
