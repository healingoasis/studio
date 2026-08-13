# Student intake portal

Idea: `ideas/2026-08-12-student-intake-portal.md`

## Run it

```bash
pnpm --filter student-intake-portal dev
```

Then open <http://localhost:3111>. (Port 3111 rather than 3100 — something else on
Daniel's Mac already listens on 3100.)

Needs `SHOPIFY_CLIENT_ID` and `SHOPIFY_SECRET_KEY` in `.env.local` at the top of the
studio folder. `SHOPIFY_STORE` falls back to `healing-oasis-us.myshopify.com`.

## What is real and what is not

**Real, read live from Shopify on every page load:** the students, which program they
are on, which class, what they have paid, when, and what is still owed. Built from the
last few hundred orders; anyone who only ever bought merch, a seminar, or a conference
ticket is filtered out.

**Real, read from the store's public product feed:** the shop shelves — product titles,
prices, photographs and whether something is sold out.

Only merchandise has photographs on the store; the programs, seminars and conference have
none. Rather than leave those shelves looking unfinished, they get a **typographic cover**
— the title set on a tinted panel. It is deliberately not a stock photo, because a
stand-in that looks like a photograph of something implies a photograph of that thing.
**Upload a real photo to any of those products in Shopify and it takes over
automatically** — nothing here needs changing.

Prices show as a **range wherever a product's variants differ**, with the choices spelled
out underneath ("Cover or Full Bale", "4 flavors · 8oz or 16oz"). This matters: a bale
photo shows the full bale at $387.75 while the cover alone is $224.38, so a single
cheapest-variant price against that photo would misrepresent what someone is buying.

## The card fee

Every price on the store already has a **3.4% card processing fee baked in**, marked by a
`cc-fee-included` tag. That is why a $200 deposit lists at $206.80 and an $8,189 balance
at $8,467 — a student sees only the higher number and cannot tell what the school
actually charges.

Detail and program pages carry **one quiet line under the price** — "Includes 3.4% card
processing ($285.00) · $8,389.00 by check". Deliberately not a full invoice breakdown:
which way to pay is chosen at Shopify's checkout, so this only has to be formal and
complete, not persuade anyone. The rate lives in one place, `CARD_FEE_RATE` in
`lib/shop.ts`.

Every listed price on the store divides back to a whole dollar at this rate (checked
across all 36 products and every variant), so the base is recovered by rounding rather
than left a penny adrift. **If the rate ever changes, that constant is the one edit** —
but note the recovery only stays exact while base prices are whole dollars.

## Buying something

Clicking merchandise or a seminar opens `/shop/<handle>` — photographs, then the store's
own description, then everything about money at the bottom: the choices, the price, the
card-fee line and the buy button.

**Price never appears at the top.** Someone should read what a thing is before being
asked what it costs. Picking a different option updates both the price and what the
button will buy.

Where a product's variants cost different amounts, **each choice carries its own price**
— the conference offers Veterinary Technician, Doctors, APRVT Candidate and ACVSMR
Resident at four different rates, so someone picks by their own credential and sees the
cost on the button. Where every variant costs the same (hoodie sizes) the prices are left
off, and where there is only one thing to pick (a single "Regular" registration) the
chooser is hidden entirely — one price, one button.

`ProductDetail.options` deliberately keeps Shopify's full option list, placeholders
included, because a variant's `options` array is positional. Filtering it would misalign
the indices used to match a selection back to a variant; `is_real_option` decides what
the view shows instead.

**Programs work differently.** The store sells one product per cohort ("VSMT 2027 Spring
Class — Pay in Full"), which is right for taking money but wrong for browsing — someone
deciding whether to do VSMT does not want four near-identical cards. So the shelf shows
**one card per program with no price**, and `/program/<key>` turns the cohorts into a
"choose a class" control. Picking a class swaps in that class's module schedule and
price, and the enrol button buys that exact class.

Each class offers **pay in full or pay the deposit**, matching the website. Deposits are
matched to their class by handle (`vsmt-2026-fall-full` → `vsmt-2026-fall-deposit`),
falling back to matching on program and term — Acupuncture's deposit is just
`acupuncture-program`, so the naming rule alone would miss it. The note under the buttons
works out and states the balance that would remain.

**Buy now** follows a Shopify cart permalink, which drops that exact variant in the
basket and lands on the store's checkout. Every part of paying happens on Shopify; this
app never touches money, a card, or an order.

Product descriptions are HTML written in Shopify's editor. They are **sanitised before
rendering**: everything is discarded except a short list of formatting tags, every
attribute is dropped, and links survive only if they are `http(s)` and are forced to
`rel="noopener noreferrer"`.

Test products (`TEST`, `do not buy`) and exhibitor or sponsorship products are excluded
everywhere — a student should never be sold a trade stand.

**Real:** the required-document lists, taken from Daniel's admissions comparison document
(the VSMT, VMRT, Acupuncture and Cranio/Sacral application forms, 2026). They differ per
program, so each program carries its own list in `lib/documents.ts`.

**Invented:** every document *status*. Nothing tracks paperwork today, so there is nothing
to read. Statuses are generated from a hash of the customer id, biased by how far along
they are on payments, so a given person always shows the same thing instead of
reshuffling on each load.

## Two stages

The page changes shape depending on where someone is, because what matters to them
changes:

**Applying** (anything still owed) — the whole page is about getting their admission
paperwork in. No tabs, one list, front and centre.

**Enrolled** (tuition settled) — the paperwork stops being the headline and becomes one
tab of a student record: **Admission Documents**, **Student Documents**, then Grades,
Evaluations and Diploma.

## Which way documents travel

This is the thing to get right, and it differs by tab:

- **Admission Documents** — *student → school*. The only tab a student uploads to. Four
  colours, chase-able, because the school is waiting on them.
- **Everything else** — *school → student*. The office publishes a record; the student
  reads it and never uploads. So there is no status to chase, only **Available** or
  **Not issued yet**, and the four-colour legend is hidden.

The **Send** and **Withdraw** controls on the issued tabs are office actions. This
prototype has no login, so they are visible with a note saying a student would not see
them — with a real login they would be behind staff permissions.

Issued records start genuinely **empty**. Unlike the admission statuses, nothing is
generated: fake results and certificates against a real student's name would be believed.

Those last three are **deliberately empty** and marked "soon". They show where the thing
is heading without inventing marks or certificates — there is no source to read them
from yet. The empty panel says so plainly rather than showing a fake table.

The switch is `remaining === 0 && paid > 0`, so it happens on its own when the last
payment lands in Shopify.

The Student Documents list is a **draft** and needs Daniel's corrections, the same way
the admission lists did before he supplied the real ones.

## The fifth state

Daniel specified four colours: red nothing, yellow in progress, green good to go, orange
needs a new or updated document. Several real requirements only apply to some applicants
— the non-veterinary waiver, the final-semester student waiver, the out-of-North-America
paperwork, the NBCE score for chiropractors on Acupuncture.

Those get a **neutral grey "not needed"**, deliberately colourless so it does not read as
a fifth colour in the code, and they are excluded from the "x of y good to go" count.
Each one also shows the rule that decides whether it applies.

Which applicants those conditions apply to is not knowable from Shopify — it needs the
applicant's credential, which lives on the application form. For now the grey states are
generated along with the rest.

## Uploads

Every requirement has an **Upload** button. Sending a file:

- saves it to `.data/intake-uploads/<student>/` at the top of the studio folder
- turns the requirement **yellow** — it has arrived, but nobody has checked it
- shows the file name, size and date, as a link that opens the document
- offers **Replace** (the old file is deleted) and **Remove**

Clicking the coloured status label moves it on — yellow to green when the office has
checked it, orange when it is expiring. Uploads and status changes both persist; they
survive a restart.

Accepted: PDF, JPG, PNG, HEIC, WEBP, DOC, DOCX, up to 20 MB. Anything else is refused
with a plain-language message. Document ids are validated against the known list and
stored names are generated, so a crafted file name or id cannot write outside the folder.

## Where student data lives

Names, emails, and orders are fetched from Shopify server-side per request and rendered.
Nothing from Shopify is cached to the filesystem or committed. The page is
`force-dynamic` and `isrFlushToDisk` is off so Next cannot write a copy either.

Uploaded documents **are** written to disk, in `.data/`, which `.gitignore` marks as
never-tracked. They stay on this machine and go nowhere else. Those are real personal
documents once Daniel starts using this for real, which is the main reason the live
version needs Dan: proper storage, behind a login, with access control.

There is a **Hide names** toggle in the header, which blurs names for screenshots and
over-the-shoulder demos.

## How balances are worked out

Tuition comes from the program's own "pay in full" product, which already includes the
card fee. Paid is the sum of net payments on that student's program orders (refunds and
voids excluded, pending orders counted as not paid). Anything within $300 of settled is
treated as settled, because students who pay by cheque or get the fee waived pay the base
price and would otherwise show a phantom balance.

That tolerance is a prototype shortcut, not accounting.

## Shape of it

```
lib/env.ts          reads .env.local from the repo root (Next only looks in the app folder)
lib/shopify.ts      swaps app credentials for a short-lived token, runs Admin GraphQL
lib/students.ts     turns orders into one row per person, works out standing and balance
lib/shop.ts         the shop shelves, from the store's public product feed
lib/documents.ts    the requirement lists, and the invented starting statuses
lib/uploads.ts      saving, replacing, removing and reading back uploaded files
app/api/documents/  upload, change status, remove, and serve a file back
app/shop/[handle]/  one product: photos, description, choices, buy button
app/program/[key]/  one program: choose a class, then its schedule, price and enrol
app/page.tsx        server component, fetches, handles failure in plain language
app/portal.tsx      the whole interface
mockup.html         the original static mockup, kept for reference
```

## Not built yet

**No login.** Anyone who can reach the port can see every student and every uploaded
document, and can upload on anyone's behalf. That is fine for a prototype running on one
Mac and is the single biggest thing standing between this and something students could
actually use.

Also missing: storage that is not one folder on one laptop, notifications when something
turns orange, and writing anything back to Shopify. All Dan conversations.
