---
title: Five ways to draw a horse, none of them good enough
date: 2026-08-31
---

Daniel needed a body condition diagram at the standard a veterinary school would publish.
Across one session I tried five distinct methods. Recording all of them so nobody repeats them.

## 1. Hand-authored spline outline, painted

~50 named anatomical anchors, Catmull-Rom outline, blurred tonal shading clipped to the
silhouette, surface anatomy, coat grain. Technically the most elaborate. Verdict: *"looks like a
child drew it."* The rendering was fine; the underlying shape was mine, and it was wrong.

## 2. The same outline, flat

Stripped to one tone and one contour. Better — a diagram rather than a bad painting — and it
gained a dashed ideal-5 overlay that a photograph cannot do. Still rejected at size.

## 3. Proportion correction from measurements

Diagnosed foal proportions (big blunt head, short thick legs, round barrel) and corrected them:
head scaled 0.86 about the poll, underline lifted, cannons slimmed, ears redrawn. **Result was
worse** — pin head, rabbit ears, hooves adrift. Reverted.

## 4. Silhouette extraction from the photograph

Flood-fill Captain out of the background, morphological opening to shed the fence rails, largest
component, hole fill, Moore-neighbour boundary trace, Douglas-Peucker, Chaikin.

- At threshold 48 the head and neck vanish — his lit topline and face are brighter than the cut.
- **At threshold 78 with a 3-pass opening the mask is a complete, correct horse.** This part works.
- Tracing it does not. Light smoothing gives a lumpy blob; heavy smoothing dissolves the head and
  legs. His pose is the problem: head turned to camera, halter on, mid-stride, mane breaking the
  topline, fence occluding the legs.

Also checked every background horse in all four photographs for a usable lateral pose. None:
all small, occluded by fencing, or facing the camera.

## 5. Constructive anatomical masses

Overlapping ellipses and tapered capsules unioned into a silhouette — how illustrators actually
build animals, and parametric rather than curve-judgement. Produced a bloated sheep.

## What this means

It is not a time problem and it is not complexity. Judging and correcting organic form is the
limit. More iterations of any of the above produce the same class of result.

## What will work

**One clean photograph.** Method 4's extraction stage already produces a complete silhouette; it
only failed at the trace because of the pose. Given a horse standing square, true side-on, no
halter, plain background, flat overcast light, short coat — the trace should come out clean and
the whole animated diagram can be built off a real animal's outline.

Failing that, `docs/handoffs/2026-08-31-illustration-brief.md` commissions nine proper plates.


## Postscript: the photographs themselves

Measured before touching them: mean saturation 13 on both Captain frames (near monochrome),
tones spanning only 17-218 instead of a full range. Flat, under-processed phone snapshots.

`scripts/photo-grade.py` now grades them: levels from the luminance histogram, a gentle S-curve,
a shadow-recovery term that opens up a black horse's coat without greying the blacks, a highlight
knee so the overcast sky does not clip, a small warm shift, +14% saturation, a light vignette and
an unsharp mask. Regenerates `web/` and the `bcs-captain-lateral.jpg` crop.

First pass was set far too hot — saturation 1.30 and an S of 0.55 turned Red orange and blew the
skies. Grading should be invisible. The shipped numbers are half that.

Background separation was tried and thrown away: blurring behind the horse read as fake, and a
mask edge that is even slightly wrong looks worse than no effect at all.

Product shots were left alone — they are studio frames on white and this pipeline is built for
outdoor light.


## The resolution: annotation, not anatomy

The pattern across every failure is the same. What I can render to a professional standard is
**precise geometric annotation** — numbered markers, smooth measured curves, filled bands,
typography, tables. What I cannot render is **anatomy**: a horse, or a skeleton, drawn or
overlaid, always comes out amateur.

So the Learn page now contains no drawn horse anywhere:

- the six places, marked on the photograph
- Change: Captain's own topline and underline in white, the chosen score's projection over them,
  the band between filled
- the nine-score row: nine copies of the photograph, each with that score's projection
- the comparison: two photographs, same treatment
- the printable chart: nine photographs plus the description table, using `<img>` rather than a
  CSS background so it survives printing with background graphics off

The Diagram view is retired. The Skeleton view still uses the drawn horse; a photograph-based
skeleton was attempted over four passes and the ribs kept reading as a comb, so it stays for now
and should be the first thing replaced when real artwork arrives.


## Method 6, and the one that worked: reshape the photograph

The reason it still did not feel real, after everything, is that Captain is a *healthy* horse.
Drawn lines predicting where a thin horse's back would sit are not the same as seeing a thin
horse.

So the photograph itself is now reshaped, live, on a canvas. For each 2px column between
x=168 and x=414 it is redrawn in three pieces:

1. a band of background above the topline, stretched to meet the new topline
2. the body, resampled from its old span to its new one
3. a band below the belly, stretched back down to meet the untouched region

Because only those three bands move, **the fence rails behind him stay straight** — which is what
kills every naive warp. The displacement comes from the same measured topline and underline
curves and their per-point weights, so it tapers to nothing at the withers and the dock.

It drives the main view, the nine-score row, the comparison and the printable chart. One
photograph, no extra file weight, and it animates under the Play control.

### The honesty line

This makes a simulated image of a real, identifiable rescue horse, so it is labelled everywhere
it appears: *"The horse in this photograph has been reshaped… Simulated from his own photograph.
Captain was never in this condition."* The caption reads "Simulated · Captain reshaped to a 2",
the 5 is marked as his true photograph untouched, and the printed chart says so in its footer.
Do not remove those labels.
