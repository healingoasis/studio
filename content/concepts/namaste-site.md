# Namaste Equine Rescue — full site concept

Built 2026-08-26 for Daniel, to show the rescue's team. Private unless he shares it.
Ten pages, every one clickable, plus a proposed shop. Nothing connected to anything live.

Source template: `namaste-site-source.html` (with {{IMAGE}} placeholders)
Photographs: `assets/` (originals) and `assets/web/` (compressed, used in the build)
Build: `python3 scripts/build-namaste-site.py <output.html>`

## Pages

Home · About · Our Horses · Alumni · Adopt · Foster · Volunteer · Donate · Shop · Contact

Every factual claim is sourced from namasteequinerescue.org, read page by page on
2026-08-26. Nothing about horses, people, money, or outcomes was invented.

## The shop

Every product opens its own page: large garment view, colorway switching, size picker,
specs, size guide, and a panel showing the print artwork on its own at full size with the
story behind it. Five products, spanning a $12 entry point to a $58 anchor:

| Item | Price | Why |
|---|---|---|
| Intake Record Hoodie | $58 | Back print taken from a real intake file header |
| "+250" Recovery Tee | $32 | Red's actual weight gain after the 2015 seizure |
| Barn Beanie | $28 | Orchid mark from their own logo; Wisconsin winter chores |
| Canvas Feed Tote | $24 | "Hay. Water. Time." — what a starved horse needs, in order |
| Case File Sticker Sheet | $12 | Cheapest way for a distant supporter to say yes |

### The mockups are photographs

The garments are **real photographs of real blank garments**, licensed from Unsplash
(free for commercial use, no attribution required), with the rescue's artwork printed onto
them in `scripts/build-namaste-mockups.py`. This is how a merchandise run is proofed before
any of it is made.

The compositing is not an overlay. For each print the script reads the luminance of the
cloth underneath and modulates the ink by it, so the design sinks into the folds and
shadows of the actual fabric. Sources and treatment:

- **Crewneck and tee** — one studio hanger shot, so both share lighting and sweep. The
  three garments in that frame overlap, so each is cut out by walking the rows and keeping
  only the dark run the centre falls inside.
- **Beanie** — a charcoal cuffed knit that arrived with another brand's woven patch; ours
  is pasted over it with a contact shadow, carrying the rescue's own logo unaltered.
- **Tote** — natural canvas, with the previous brand's mark cloned out before printing.
- **Stickers** — drawn flat, because a sticker sheet *is* flat, then given a paper shadow.

One colourway per product: only the photographed colour is offered, rather than faking
variants that were never shot.

## Open questions for the board (do not answer these on the page)

- **"100% goes back to the horses" is a proposal, not current policy.** The board has to
  actually commit to it before this line can go on a live site.
- **Tax-deductible status is not published** on the current site — no 501(c)(3) mention,
  no EIN. The donate page deliberately makes no tax claim. Worth confirming.
- **Adoption fees** are not published either; the FAQ says "case by case" rather than
  inventing a number.
- **Photography is the biggest gap.** Two horse photographs for an entire rescue. Kat has
  no picture at all, and the page says so rather than substituting a stand-in horse.

## Verified before handing over

Ten routes render; no horizontal overflow at any width; light and dark themes both checked;
mobile header, menu, and all nine links checked at 390px; bag add/remove/quantity and the
honest "not connected" checkout checked; US spelling swept.
