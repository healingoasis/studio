---
title: Why the Henneke tool is a drawing and not Red's photograph
date: 2026-08-28
---

## What changed

The six body-condition points on the Learn page used to be absolutely-positioned dots over the
photograph of Red. Daniel flagged that they were not landing on the animal. He was right: the
Loin dot sat roughly twenty pixels above his back, in the sky, and the Tailhead dot was off past
his rump on the fence.

## Why nudging the percentages would not have fixed it

Red is standing at a three-quarter angle facing the camera, not side-on. His hindquarters are
turned away and his tail covers the dock. Three of the six Henneke sites — ribs, loin, tailhead —
cannot be honestly marked on that frame at any coordinate. It is also the only usable photograph
of him we have.

## What replaced it

A horse drawn in true lateral view, in `content/concepts/namaste-site-source.html`:

- The outline is a closed Catmull-Rom spline through ~50 named anatomical anchors
  (`HORSE_ANCHORS`), converted to cubic Beziers. Anchors flagged as corners keep hooves and
  hocks sharp.
- Each anchor carries a **condition vector**: where that piece of the body moves at score 9.
  Score 1 is its negative, score 5 is the drawing as authored. So one authored outline yields
  all nine scores, and the horse visibly changes shape as you move the scale.
- The head and legs carry no vector. Condition does not change them — which is precisely why
  Henneke scores the six soft-tissue sites and not the skeleton.
- The six sites (`HORSE_POINTS`) are SVG children of the same viewBox as the drawing, so they
  scale with it and **cannot drift** at any screen size. That was the whole point of the change.
- Ribs fade out by a 5 (at a 5 you feel them, you do not see them); the spine ridge and point of
  hip surface only below a 4.

Red's photograph stays on the page as the real case, with no markers on it.

## Watch out for

`host.className = ...` does not work on an SVG element — `className` there is a read-only
`SVGAnimatedString`. Use `setAttribute("class", ...)`. That one line threw during init and blanked
the whole page, because `initBCS()` runs before `render()` and `route()` on the same line.


## 2026-08-31 — rebuilt again, properly

Daniel's verdict on the flat-fill version: *"that drawing is horrible ... i need next level
design and i want this to be mind blowing and how informative it is."* Fair. A flat silhouette
does not teach anyone to read a horse.

There is no photograph that can do this job. Red is at a three-quarter angle; Captain is black,
mid-stride and small in frame; and no photograph can show the same horse at all nine scores.
So the illustration had to carry it.

What it is now, in `content/concepts/namaste-site-source.html`:

- Same anchor-and-condition-vector system, rebuilt at a 1200x800 viewBox with real equine
  proportions (body length equals height at the withers; body depth equals leg length).
- **Tonal modelling.** Shading paths and ellipses are blurred with SVG filters and clipped to
  the silhouette, so they read as airbrushed volume but stop crisply at the contour. All of it
  is hung off the anchors, so the shading tracks the body as it changes.
- **Condition changes tone, not just outline.** `h_tone()` fades the muscle highlights and
  deepens the shadows as the score drops; `h_hollows()` opens the paralumbar fossa, the hollow
  behind the shoulder and the hollows beside the dock below a 4.5.
- **A skeleton layer.** Cervical vertebrae (running low in the neck, well below the crest you
  palpate), thoracolumbar spine, spinous processes, nine ribs, scapula, pelvis, limb bones,
  skull. Toggled from the figure's footer.
- **A fat cutaway** under the tool: skin, fat, muscle, bone, with only the fat band scaling to
  the score. Labelled as relative depth, never measured.

### Performance

The blur filters made per-frame `innerHTML` rebuilds during the tween far too expensive. The
renderer now builds the SVG **once** (`buildHorse`) and thereafter only sets attributes
(`drawHorse`), and the shading shares two filtered groups rather than a filter per element.

### Naming

The geometry module's functions are all prefixed `h_` because it lives inside the page's single
IIFE alongside the shop and the router, and names like `points`, `outline`, `tail` and `open`
would otherwise collide.
