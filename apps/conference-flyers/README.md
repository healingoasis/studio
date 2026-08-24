# 2026 Conference flyers

Three flyer options for posting the 2026 Healing Oasis Conference in a Facebook
group. All three sell both ways to attend: in person and live stream.

Canvas (compare and export): the "2026 Conference Flyers" artifact.
Ready-to-post PNGs: `build/flyer-{a,b,c}.png`, 1080x1350 (Facebook portrait).

## Editing

`parts/{A,B,C}.body.html` hold the markup — one copy each. `node build.mjs`
regenerates both the standalone previews and the canvas artboards from those
parts, so the two can never drift. Re-render the PNGs with:

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless=new --window-size=1080,1350 --virtual-time-budget=6000 \
      --screenshot=build/flyer-a.png "file://$PWD/preview-a.html"

## Every fact came from the live site

Checked against healingoasis.edu/conference-2026/attend on 2026-08-24: dates,
venue, the two attendance formats, canine/equine track, 16 speakers, max 20 CE
contact hours, current regular prices ($450 vet techs, $580 doctors), and the
October 12 registration deadline.

Two problems on the live site, flagged for Daniel, not changed:

- The attend page gives the venue ZIP as 60141. National University of Health
  Sciences' own site says 60148. The flyers omit the ZIP rather than repeat it.
- The page still pitches early bird pricing "through August 3, 2026", a date
  that has passed. The flyers use regular pricing, which is correct for now.
