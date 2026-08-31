---
name: Name tags, cohort folders, and what the store cannot tell us
created: 2026-08-31
---

## The name tag is drawn as SVG, on purpose

`NAME ID for the Table.pdf` places three lines by their **baselines**, in points, on a
792 x 612 pt page. HTML cannot place a baseline — it places a box, and where the baseline
falls inside that box depends on the ascent of whichever font actually loaded. The first
attempt used a fudged ascent ratio (0.73) and landed the big line ~8 pt low in Georgia.

The card is now an inline SVG with `viewBox="0 0 792 612"`, where `<text y>` *is* the
baseline. Every number is now taken straight from the PDF and needs no correction:

| | size | baseline from top |
|---|---|---|
| First name | 72.024 | 327.05 |
| Last name, Degree | 36 | 377.59 |
| State | 12 | 397.15 |

Logo at (76.9, 281.9), 124.6 x 144.6, on a white block at (69.75, 278.25), 139 x 151.8.
Everything centred on x = 396 — the page centre, not the centre of the space beside the
logo. Verified by printing to PDF: 15 pages, every MediaBox `0 0 792 612`, identical to
Daniel's original.

## The font is not exact and cannot be, here

The original is **Bookman Old Style**, which ships with Microsoft Office. It is not
installed on this Mac (measured: `"Bookman Old Style", serif` renders at exactly the
generic-serif width). The stack falls through to Georgia. Because the layout is baseline-
driven, a machine that *does* have Bookman puts every line in exactly the same place —
only the letterforms change. If Daniel wants it identical here, either Bookman Old Style
gets installed, or a metric-compatible open font gets bundled. Not done unasked: it means
downloading a font file.

## What the store cannot answer

- **Degree is nowhere in Shopify.** Typed once per student in the class page, saved in
  `.data/office-roster/`.
- **State is on the order address** (present on 58 of the last 60 orders), and can be
  corrected the same way.
- **The class is guessed from the product title.** "VSMT Fall 2026 - Remaining Balance"
  places somebody; "VSMT Program Deposit" does not. 13 of 32 VSMT students are unplaced
  and sit in a holding folder until the office puts them somewhere.
- **Nothing records a withdrawal.** Office-set, and a withdrawn student leaves the print
  list immediately. Moving to the next intake is just a change of class — there is no
  separate "moved" state, which removes a whole category of bug.
- **Some customers are not people.** "Whitewater Hospital", "Fredonia Vet Clinic", and
  "null Kasten" all appear. Those are flagged in red on the class page and on the print
  sheet rather than quietly printed onto a card.

## A live test product was reaching the roster

"LAB — VSMT Fall 2026 (TEST — do not buy)" is a real, live product. Dan Borgia's test
order against it was creating a 16th VSMT student. Test lines are now filtered out
(`is_test_line`). Checked: the only person removed is Dan, whose sole order was the test
one. Michelle Rivera also has a "test 1" order but keeps her real VSMT deposit.

## For Dan: student data in the page payload

Server-rendered pages inline part of the raw Shopify response into the RSC flight data,
so page HTML carries customer names and emails — 45 on the main portal page. This is
pre-existing (the roster is passed to a client component by design) and is contained:
the app is bound to this Mac, and the shareable build runs on invented students. Worth
knowing before anything here is ever hosted.
