# Plan: student intake portal mockup

Idea: `ideas/2026-08-12-student-intake-portal.md`

## Scope of this pass

A **clickable mockup only**. No login, no database, no real student data, no writes to
the Shopify store. The goal is for Daniel to see the thing and react to it — especially
to correct the required-document list, which is the part only he knows.

## What is real vs. faked

Real (pulled from the store's public `products.json`, no credentials needed):

- Program names and tuition: VSMT $8,674.00, VMRT $6,399.00, Acupuncture $8,375.00
- Deposit product: $206.80; balance products exist per program
  (`vsmt-program-balance`, `vmrt-program-balance`, `acupuncture-program-balance`)
- CE seminars: Cranio-sacral $682.00, Applied Kinesiology $682.00, 2026 Conference $465.30
- Merch: Hoodie $51.70, Beanies $20.68, St Roccos Treats $15.51, Bales $224.38

Faked: all six students, their documents, and their payment histories. No real PII
touches this repo, per `docs/tools.md`.

## Shopify credentials — not used, and why

`.env.local` holds `SHOPIFY_CLIENT_ID` / `SHOPIFY_SECRET_KEY`. Those are OAuth app
credentials, not an Admin API access token, and `SHOPIFY_STORE` is still unset — so
they cannot query the Admin API as-is anyway. Not needed here: the storefront product
feed is public. Buy and pay buttons link to real **product pages** on the store, not
cart permalinks, so a click can never charge anyone during a demo.

## Build

Single self-contained `index.html` in `apps/student-intake-portal/`. No build step, no
install — Daniel opens a link. Also published as an Artifact so he gets a URL he can
open on a phone and forward to staff.

## Design decisions

- The four status colors are the only saturated color on the page, so they read at a
  glance. Interactive chrome uses a deep teal that is clearly not a status color.
- Red / yellow / orange are close in hue, so each status also carries its **own icon
  and its own text label** — color is never the only signal. This matters for
  colorblind staff and for printing.
- Two views off one dataset: **Student view** (one person, what they owe, what to send)
  and **Office view** (whole roster, who is not ready). Clicking a student in the office
  roster opens their student view.
- Clicking a document cycles its status, so Daniel can watch the colors change and feel
  what "real time" means without any backend.

## Explicitly not in this pass

Login, file upload, storage, notifications, real balances from real orders, syncing a
paid balance back to the document tracker. All of that is a `with-dan` conversation
because it involves student PII and live store access.
