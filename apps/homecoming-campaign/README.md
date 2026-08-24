# 2026 Homecoming Conference — 30-day campaign

Twelve posts, 25 August to 27 September 2026, every two or three days.
**Every post is its own design.** There is no shared template: `shell.mjs` supplies
only the palette, the two typefaces and the 1080x1350 canvas. Each `designs/dNN.mjs`
draws its own layout.

    01 invitation     cinematic photo poster, one word
    02 faculty wall   sixteen headshots, every speaker named
    03 lecture title  editorial pull-quote, no hero photo
    04 twenty hours   one numeral at absurd scale
    05 the split      frame cut down the middle, two arguments
    06 canine         title card, cream bar struck through the photo
    07 equine         stacked bands, deliberately inverted from 06
    08 the ticket     the price list drawn as a ticket with a stub
    09 the calendar   September and October, every deadline marked
    10 three days     photo triptych, one sentence per band
    11 discounts      three percentages as slabs of colour
    12 last call      near-black, one date, negative space

    node build.mjs      designs -> out/*.html
    node gallery.mjs    -> review.html (self-contained review page)

Render at 1080x1350 with headless Chrome, then export JPEGs to `jpg/`.

## Where the material came from

Photographs: Daniel's Conference, CE and Acupuncture folders. Speaker headshots
were cropped out of the sixteen speaker cards already sitting in the 2026 Drive
folder. Lecture titles come from those same cards.

"2026 Homecoming Conference" is the name used on the official speaker-list PDF
published on healingoasis.edu. The attend page calls it "the 2026 Conference" —
worth making those agree.

## Facts

29 claims checked against healingoasis.edu/conference-2026/attend on 2026-08-24,
all passing: dates, venue, CE hours and every accrediting body, the RACE ID, the
hotel block and its cutoff, all four registration rates, all three discounts,
both deadlines, and every speaker name used. The September and October calendar
grids are verified against the real 2026 calendar.

No post carries the expired early-bird pricing or the disputed venue ZIP. Nothing
claims Friday and Sunday are joint sessions — the site only confirms the Saturday
track split.

## Delivery

Google Drive: Marketing / Conference / 2026 / Conference Campaign 30 Day, via the
Google Drive for Desktop synced folder. Same set in ConferenceMedia on the Mac.

## Rebuilt as carousels (2026-08-24)

Same research, same conclusion as the acupuncture campaign: carousels over single
posters, six slides each, nothing below 34px so it reads on a phone.

`carousel/` holds the current work: 8 carousels, 48 slides.
`designs/` holds the superseded single posters, kept for reference.

Carousel 02 is the lever — sixteen speakers, each named and pictured. Sent to the
speakers to reshare, it is the only realistic route past the school's own reach.
21 facts checked against the live site, all passing.
