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

Garments are drawn, not photographed — the rescue has only four usable photographs, and a
faked product shoot would be a lie on a page whose whole argument is that the numbers are
real. They are rendered rather than sketched: one shared light source across every panel,
gradient shading, seam stitching, ribbed cuffs, a cloth-noise displacement filter on the
fabric and a lighter one on the ink so prints read as screen-printed rather than pasted on.
Product stages keep a fixed studio backdrop in both themes, because a product shot is a
photograph and photographs do not invert.

The print artwork is designed to be looked at on its own, not just shrunk onto a chest:
the hoodie carries a full bordered intake form, the tee an enormous +250, the tote the
three words stacked. Each product page shows that artwork large, on its own fabric colour.

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
