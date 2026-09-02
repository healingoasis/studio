# How a reel gets made here

Written after four rounds of rework on one 23-second film. Every round failed
the same way: shots were chosen for what was in them, and only judged on
technical quality after Daniel watched the result. Softness, camera shake and
sensor noise are invisible on a contact sheet and obvious full screen on a
phone. So the order has to change — measure first, choose second.

## The order of work

1. **Index the footage** (`tools/footage-index`) so every moment is findable.
2. **Score candidate moments** (`shotscore.py`) on sharpness, steadiness,
   noise and exposure. Score on the ACTUAL 9:16 crop, not the full frame —
   cropping to a third of the picture magnifies softness, and measuring the
   whole frame hides it. This mistake made a soft shot look fine.
3. **Build only from what scores well.** Nothing below ~70 goes in unless the
   content is irreplaceable, and then only briefly.
4. **Review, and measure the finished file too**, not just the sources.

## What the numbers mean

Measured on this footage, on the shipped crop:

| Measure | Good | Bad | Fixable? |
|---|---|---|---|
| sharpness (edge energy) | 28-40 | under 20 | **no** |
| steadiness (frame-to-frame) | under 3 | over 8 | **no** (see below) |
| noise (residual on flat areas) | under 3 | over 6 | yes, denoise |
| blown highlights | under 2% | over 8% | partly |

Sharpness and steadiness carry 75% of the composite score because they are the
two a viewer reads instantly as amateur, and neither can be repaired.

**Stabilisation is not available.** This ffmpeg has no `vidstab`; the built-in
`deshake` was tested on a shaky shot and made it measurably worse (shake 8.9 to
10.8). So shake is a selection criterion, not a post-process. If stabilisation
is ever needed, that is an ffmpeg build with `--enable-libvidstab`, which is a
job for Dan.

## What the platform rewards

From current guidance, not guesswork:

- **The first 3 seconds decide distribution.** Reels that lose more than half
  their viewers in 3 seconds rarely recover. The opening must earn attention,
  not set up context.
- **Completion rate beats length.** 7-15s gets the highest completion; 30-60s
  drives more saves and shares. A long film with weak retention loses to a
  short one that finishes.
- **Reach follows watch time, shares and saves** — not follower count.
- **Native beats recycled.** Audio added inside the app counts as platform
  audio and travels further than an uploaded soundtrack, which is why these
  ship silent.

Sources: Buffer, Hootsuite, Insta24, creatorflow (2026 guidance).

## Craft rules that came out of the rework

- **Every claim on screen must be sourced.** All programme facts come from
  healingoasis.edu, never memory.
- **Only show the modality being sold.** An early cut mixed in palpation and
  manual therapy; that is a different modality and does not belong.
- **Alternate subject and scale every shot.** Four near-identical angles of one
  dog's back read as one long take, not an edit.
- **Slow motion exactly twice** — the open and the payoff. Used everywhere it
  emphasises nothing.
- **Type must move.** Static white text read as dead. It now rises into place
  over 0.22s with a fade, and the payoff line of each pair is in accent cyan.
- **Light beats grading.** The same session shot in daylight measured far
  cleaner than the part in shadow. Choosing the brighter take beat any amount
  of noise reduction.

## The failure this all exists to prevent

Round one used non-acupuncture footage. Round two repeated four near-identical
shots. Round three was grainy and flat. Round four had soft and shaky horse
shots. Every one of those was findable by measurement before Daniel ever saw
it — and none of them were found by looking at thumbnails.
