# The social machine

Goal: one shoot goes in, a complete set of ready-to-post assets comes out —
tested, consistent, and good enough that nobody asks who made it.

Built one station at a time. A station is not finished until Daniel says the
output is right, because the whole point is that later stations inherit the
standard set by the earlier ones.

## Stations

**1. Reels — in progress**
Vertical video, hook in the first three seconds, claims on screen because most
people watch muted, one call to action with a date.
- `tools/footage-index` finds the moments
- `tools/reel/shotscore.py` ranks them
- `tools/reel/certify.py` checks every frame of every shot: sharpness, camera
  movement, noise, and small moving objects (this is what caught the fly)
- `tools/reel/edit_acupuncture.py` assembles
- Status: technically clean. Awaiting Daniel's verdict on whether it *sells*.

**2. Thumbnails / cover frames** — not started
The still that decides whether a reel gets opened at all. Should come from the
same certified runs, chosen for face, contrast and readability at postage-stamp
size. Needs its own scoring: a good video frame is often a poor thumbnail.

**3. Captions and hashtags** — partially done
Already produced per reel. Needs to become per-platform rather than one caption
reused, and every factual claim sourced from healingoasis.edu.

**4. Static posts and carousels** — not started
Stills from the same shoot, graded to match, with the same type system as the
reels so everything looks like one brand.

**5. Per-platform packaging** — not started
Instagram, TikTok, YouTube Shorts, Facebook, LinkedIn. Different aspect ratios,
caption lengths, hashtag conventions and first-frame rules. One source, several
correctly-shaped outputs.

**6. The scheduling sheet** — not started
What goes out where and when. Daniel says where things go; this station makes
sure nothing is missing when that time comes.

## The rule that makes it a machine

Nothing ships that has not been measured. The reel station proved why: four
rounds of rework happened because shots were judged by eye on thumbnails, where
softness, camera shake and insects are all invisible. Every station gets its own
check before it is called done.

## The constraint that no station can fix

Footage quality. Across 124 certified runs of the acupuncture shoot, 3 passed.
91% failed on camera movement alone, and there is no usable equine acupuncture
take at all. See `reel test/SHOOT-NOTES.md`. Four changes at filming time would
do more for output quality than any amount of work at this end.
