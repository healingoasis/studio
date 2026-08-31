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


## 2026-08-31, later — to a published-chart standard

Daniel again: *"i need what the highest level of education would publish or produce ... this is a
standard i am trying to teach as many people as possible."* Two separate problems in that: the
plate itself, and what a teaching reference has to carry beyond one picture.

**The plate.** Added surface anatomy — carpus and fetlock creases, coronet bands, point of hock,
jugular groove, spine of the scapula, flank fold, point of shoulder and elbow — plus a
`feTurbulence` coat grain at soft-light. The first attempt added a dozen faint lines and made it
look *worse*: a published plate carries few lines, each one certain. Cut back to five body
landmarks and five per limb. That is the lesson worth keeping.

**What a reference carries.**
- `buildStrip()` — the nine scores as one row of clean silhouettes, the way a printed chart shows
  them, each clickable. Deliberately flat: no blur, no shading, no detail lines. Chart, not plate.
- `drawZoom()` — a magnified detail of the chosen site, via `<use href="#hzArt"/>` into a second
  SVG with a tight viewBox. It is the *same* drawing, so it can never drift out of sync, and it
  costs one element. Paired with `SITE_WHERE[]`: where exactly to put the hand, in words.

Everything in the art group sits under `<g id="hzArt">` for that `<use>` to target. If you add
layers to the horse, add them inside that group or they will not appear in the detail plate.

### Still not done

No rear view. Henneke also reads the tailhead and ribs from behind, and that is a second drawing
rather than a variation on this one. Worth doing if this becomes a printed handout.


## 2026-08-31, third pass — the photograph, after all

*"cant you use one of the images from the site for now? jsut actually have the points in the
right location."* Yes — and my earlier refusal was wrong.

I had rejected all three photographs on the grounds that none was true lateral. That was the
right test for a *scoring* reference (you cannot judge condition off a three-quarter view) but
the wrong test for a *locating* one. Captain in `03-captain-a-black-horse-walking-sound-and.jpg`
is near enough to lateral that all six sites are visible and markable. Marking where the six
places are does not require the horse to be at any particular score.

### Getting the coordinates right

Eyeballing percentages is how the original dots ended up in the sky. Instead: draw a labelled
coordinate grid over the photograph with PIL, read the anatomy off it in image pixels, then
render candidate dots onto the image and look. Two passes got all six correct. The grid script
is worth repeating for any future photograph.

### The trap that cost a round

First attempt put the points at correct percentages of the *uncropped* photo — and they still
looked wrong, clustered and off the animal. The points were right; Captain simply occupies about
a third of that frame, so at the rendered width the horse is ~170px and six 40px markers cannot
sit on him without piling up. Fixed by cropping to `web/bcs-captain-lateral.jpg` (640x440, from
the 1200px original, not the 900px web copy) and remapping the fractions.

**If a photograph's subject is small in frame, crop before placing markers.** Percentages being
arithmetically correct is not the same as the overlay being usable.

### Three views

Photo / Drawing / Skeleton, photo first. Each medium does what it is good at: the photograph
shows *where*, the drawing shows *what each score looks like* (no photograph can be nine
scores), the skeleton shows *why*. The detail plate follows the active view — a magnified
background-position crop of the photograph, or `<use href="#hzArt">` on the drawing.


## 2026-08-31, later still — a correction about mobile

I told Daniel the site needed a mobile pass, on the strength of screenshots at
`--window-size=390` that showed every page clipped down the right-hand edge.

That was wrong, and the tooling caused it: **headless Chrome on macOS has a minimum window
width of about 500px.** Asking for 390 renders at 500 and then crops the screenshot to 390,
which looks exactly like horizontal overflow and is not.

To get a true narrow viewport, load the page in an `<iframe width="390">` inside a wrapper page
and screenshot the wrapper (with `--allow-file-access-from-files` if you also want to reach into
the frame's DOM). Measured that way the Learn page reports `clientWidth 390, scrollWidth 390` —
no overflow anywhere, and the only elements past the right edge are the cart drawer, which is
parked off-screen deliberately.

**Do not trust a narrow `--window-size` screenshot as a mobile check.**
