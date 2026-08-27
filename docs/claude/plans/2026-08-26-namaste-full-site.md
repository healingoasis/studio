---
title: Namaste Equine Rescue — full site concept
date: 2026-08-26
for: Daniel (team meeting in a few weeks)
---

## What Daniel asked for

A complete, clickable website concept for Namaste Equine Rescue — every tab a real
finished page, plus a new Merchandise tab with five products chosen and designed by us.
Polished and modern, works end to end, nothing live connected. To be shown to the
rescue's team as part of taking over and revamping the organisation.

## Pages (their real site's structure, plus ours)

| Page        | Source of content                                        |
|-------------|----------------------------------------------------------|
| Home        | mission, the work, the "zero horses waiting" fact         |
| About       | founded 2014, the education realisation, board, method    |
| Our Horses  | currently none up for adoption; facility being updated    |
| Alumni      | Red, Captain "Black" Sparrow, Kat — real case records     |
| Adopt       | full requirements + process, verbatim from their site     |
| Foster      | requirements, Henneke score, vet cover, $350 emergency    |
| Volunteer   | age rules, what's needed                                  |
| Donate      | methods, in-kind wishlist, acknowledged donors            |
| Shop        | NEW — five products, designed here                        |
| Contact     | address, phone, email, hours, law-enforcement line        |

## The five products

Chosen to cover price points and real barn use. Framing: "if you can't be here in
person, wear it or carry it." Stated promise on the page: 100% of every order goes
back to the horses.

1. Intake Record Hoodie — $58
2. "+250" Recovery Tee — $32 (Red's real weight gain)
3. Barn Beanie — $28
4. Canvas Feed Tote — $24
5. Case File Sticker Sheet — $12

Garments are drawn as flat-lay illustrations, not photographs — the rescue has only
four usable photographs, so a photographic mockup would have to be faked. Flat-lay
matches the case-file design language and is honest about being a proposal.

## Rules held to

- Every factual claim traces to namasteequinerescue.org. Nothing invented about horses,
  people, money, or outcomes.
- The concept banner stays on every page. The artifact stays private to Daniel.
- No checkout, no payment fields, no email capture that pretends to work. The cart is
  real enough to click through and ends at an honest "not connected yet" note.
- "100% goes back to the rescue" is Daniel's proposal to the board, and is labelled
  on the page as the shop's promise — not presented as an existing policy.

## Build

Single self-contained page, hash routing so every tab is a real URL. Source template
in `content/concepts/namaste-site-source.html` with {{IMAGE}} placeholders; photos
live in `content/concepts/assets/` (recovered from the first concept, which had only
placeholders committed). `scripts/build-namaste-site.py` inlines them.
