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
