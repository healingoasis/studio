# Namaste Equine Rescue — full site concept

Built 2026-08-26 for Daniel, to show the rescue's team. Private unless he shares it.
Ten pages, every one clickable, plus a proposed shop. Nothing connected to anything live.

Source template: `namaste-site-source.html` (with {{IMAGE}} placeholders)
Photographs: `assets/` (originals) and `assets/web/` (compressed, used in the build)
Build: `python3 scripts/build-namaste-site.py <output.html>`

## Pages

Home · About · **Learn** · Our Horses · Alumni · Adopt · Foster · Volunteer · Donate · Shop · Contact

Every factual claim is sourced from namasteequinerescue.org, read page by page on
2026-08-26. Nothing about horses, people, money, or outcomes was invented.

## Learn — the part that sets this rescue apart

The rescue's own words: *99% of our purpose was to educate horse owners.* Until now that was
one paragraph. It is now a working tool, and it is the reason to send anyone to this site.

**Score a horse in six places.** An interactive Henneke scale with three views. **Photo** is the
default: the six sites marked on Captain, a real horse who came through this farm, measured off
the photograph and cropped tight so they sit clear of each other. **Diagram** is a flat plate,
deliberately not a painting — a photograph and a half-rendered illustration side by side make the
illustration look cheap, so the diagram commits to being a diagram. Pick any score 1-9 and it
changes shape, and a dashed line shows where an ideal 5 would sit, along the topline and the
underline: the one thing a photograph cannot do. **Skeleton** ghosts the body back and shows the
bone, which answers why those six places and not any other six. A detail plate magnifies whichever
view you are in; a cutaway shows what a hand presses through; a nine-horse row gives the whole
scale at a glance and prints. System: Don Henneke, Texas A&M, 1983. Descriptions written here.

**The ones who made it out.** Red and Captain's files now carry a four-stage recovery track —
intake, the ten dangerous days of refeeding, the long middle, and placement — with every stage
tagged either *from the file* or *from the protocol*, so a reader can see which parts are the
rescue's own record and which are the published refeeding plan. Nothing invents a number the
rescue did not write down: no weekly weights, no Henneke scores on their horses, because the
files do not contain them. Below the files, the two deficits are set against each other —
Red at 250 lb, Captain at roughly 500 — because those two figures are the proof the place works.
Kat's record stays as it is, with the missing photograph named rather than filled.

**Help us to help them.** The Donate page now makes the argument before it makes the ask.
*The fund has to be full before the phone rings* — the rescue currently has no horses waiting,
which is the best sentence on the site and also the reason to give today, because a seized horse
needs a barn, a vet and a farrier the same day and not a fundraiser. Four panels say where money
actually goes: feed on a plan (thirty small meals in the first five days, counted off the
refeeding protocol), the veterinary side (all costs but routine checkups, and the $350 a foster
home may authorize without asking), feet and the rest of it (Red's hoof issues), and months not
weeks (Captain's year). Each panel links to the page it is drawn from.

**No invented money.** The only dollar figure on the page is the $350 the rescue already
publishes in its foster agreement. A visible note says so and asks the board for the real
per-horse costs — a week of feed, a farrier visit, a full rehabilitation — which is the single
change that would most improve this page.

**Take it with you.** The Learn page ends with the two things that turn a reader into a
supporter. **Print the chart** generates a genuine one-page Henneke reference — all nine
silhouettes, the full nine-by-six matrix of descriptions, the rescue's phone number, the
attribution, and the minimum-of-4 foster line — built from the same data as the tool, landscape,
no signup required. It is the artifact to put on a barn wall. Beside it, an email capture offers
the same chart by post, which on a live site would be the only thing on the website that turns a
visitor into someone the rescue can reach again. Neither sends anything in this concept.

**Give monthly.** The Donate page now leads its ask with recurring giving — a monthly/one-time
toggle, four amounts, a custom field — argued from the rescue's own timelines rather than from
fundraising theory: a horse takes three to ten months to bring back, and Captain took over a
year, so a gift shaped the same way is worth more than the same money once. Nothing takes a
payment here.

**You cannot just feed a starved horse.** The refeeding protocol, day by day, and why the
obvious instinct kills: refeeding syndrome, roughly one in five emaciated horses lost during
refeeding, three to ten months to bring condition back. Sourced from the UC Davis refeeding
trials and the equine-nutrition guidance built on them. Framed explicitly as *why a starved
horse needs a vet*, not as a protocol for the reader to run.

**What to do**, in two lanes: the public (call your county sheriff — we cannot seize a horse and
neither can you) and a dedicated lane addressed to law enforcement with the farm's number. No
other rescue site in the state speaks to a deputy at 2am. That is the positioning.

Not veterinary advice, and the page says so twice.

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

## Light and dark

A sun/moon toggle sits in the header, left of the bag. The page follows the viewer's system
setting until someone presses it; that choice then sticks on the device. Daniel runs everything
dark, so this is how he checks what a light-mode visitor actually sees.

## Verified before handing over

Ten routes render; no horizontal overflow at any width; light and dark themes both checked;
mobile header, menu, and all nine links checked at 390px; bag add/remove/quantity and the
honest "not connected" checkout checked; US spelling swept.
