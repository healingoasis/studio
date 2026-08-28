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
