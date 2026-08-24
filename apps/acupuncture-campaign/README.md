# Veterinary Acupuncture — enrollment campaign

Twelve posts, 26 August to 14 September 2026, closing two days before Module I
opens on 16 September. **Every post is its own design.** `shell.mjs` holds only
the palette, the two typefaces, the verified program facts and the canvas size.

    01 opening        photo bleeds right, type in a tall column left
    02 the hours      132 broken into five bars that add up
    03 faculty        five portraits in a run, credentials at readable size
    04 both species   hard diagonal, canine over equine
    05 hybrid format  five cards, three screens and two buildings
    06 taught properly a specification sheet, not a pitch
    07 the hands      one photograph, almost no type
    08 the seal       a certificate mark, drawn
    09 twenty seats   the class cap as twenty marks
    10 after the cert graduate benefits, numbered
    11 what it costs  two figures, stated plainly
    12 september 16   closing date, one photograph

    node build.mjs      designs -> out/*.html
    node gallery.mjs    -> review.html

Render at 1080x1350 with headless Chrome; `deliver/` holds the posting PNGs.

The accent is brass rather than the conference campaign's ember, so the two
campaigns read as siblings and never as the same thing.

## Facts

27 claims checked against healingoasis.edu/acupuncture on 2026-08-24, all
passing: 132 hours, the five-section structure, which sections are Virtual-Live
and which face-to-face, Wednesday-to-Sunday timing, both species, the twenty
student cap and the 3-4:1 hands-on ratio, NCCAOM grounding, AHVMA CE credit, the
SOAP case requirement, all five module dates, all five faculty names with their
credentials, and every graduate benefit. Prices come from the two live Shopify
enrollment products.

Deliberate omissions:

- **No clinical claims.** Nothing says what acupuncture does to a patient. Every
  statement is about how the program is taught, quoted from the program page.
- **No total tuition figure.** The site never states one, so the posts carry the
  two real numbers instead: $200 deposit, $7,900.24 balance by check.
- **No eligibility statement.** The page does not spell out who may apply, so no
  post defines it. That gap is worth closing on the site itself.

Face-to-face venue is given as Sturtevant, Wisconsin, from the directions page
and the school mailing address; the program page itself does not state it.

## Delivery

Google Drive: Marketing / Acupuncture / MaterialToPost / feed, via the Google
Drive for Desktop synced folder. The three video reels already in that folder
were left untouched.

## Rebuilt as carousels (2026-08-24)

Research on what performs on Facebook and Instagram in 2026 changed the format:

- Static single images are the weakest option — engagement down 17% year over year.
- Carousels earn 3.4x the saves and 2.1x the shares of a static post, and the
  algorithm re-serves a carousel once a viewer swipes to slide three.
- Five to eight slides is the range that performs. Every carousel here is six.
- Key information should read at 32pt+ on mobile. A 1080px graphic renders at
  roughly 420px in a feed, so nothing here sits below 34px; body copy is 46px.
  The first single-poster set used 17-21px, which rendered at about 7px.

`carousel/` holds the current work: 12 carousels, 72 slides.
`designs/` holds the superseded single posters, kept for reference.

Sources: `source/` holds the school's own curriculum outline, which supplied the
Section One to Five content. Curriculum claims are checked against it; program
facts against healingoasis.edu/acupuncture. 43 checks, all passing.
