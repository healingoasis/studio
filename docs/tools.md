# What this workspace can reach

Plain-language inventory of the connected tools. "Wired" means Dan has set it up on
this machine (env vars in `.env.local`, CLIs installed). Check with
`bash scripts/check-env.sh`. If something is not wired yet, use `/ask-dan`.

## The Shopify store (healing-oasis-us.myshopify.com)

- [x] Wired on this machine (reading, since 2026-08-12)
- The app credentials in `.env.local` reach the Admin API through a client-credentials
  grant. The token they return carries write scopes too, so the "no changes without
  Daniel's yes" rule is convention rather than a locked door — see
  `docs/claude/notes/2026-08-12-shopify-admin-access.md`.
- Daniel is the store owner. The store runs programs, CE seminars, the conference,
  merch, and bales. Purchases for programs go through a custom multi-step form.
- Once wired: the agent can read products, orders, and customers, and can make
  changes through the Admin API. **Any change to the live store still needs
  Daniel's clear yes, and structural changes go through Dan.**

## Firebase (project: healing-oasis)

- [x] Wired on this machine (reading, since 2026-09-01)
- **The project is `healing-oasis`.** This file and `.env.example` both said
  `healing-io` until 1 September 2026; that project does not exist and never did.
  Confirmed with `gcloud projects list` — `healing-oasis` is the only one on the account.
- Access is Daniel's own Google sign-in (`daniel@healingoasis.edu`) through the Google
  Cloud CLI, not a service account key. Credentials live in `~/.config/gcloud/`, outside
  this repo. Re-do it any time with `gcloud auth login` and
  `gcloud auth application-default login`.
- Because it is Daniel's own account, the access carries **write** permission as well as
  read — same situation as the Shopify credentials. The "no changes without Daniel's yes"
  rule is convention here, not a locked door.
- What is actually in there, as of 1 September 2026:
  - Firestore, one collection: `orders` — **76 documents**. 24 carry a filled-in
    application, all 76 carry a signature, 18 have documents attached.
  - Storage bucket `healing-oasis.firebasestorage.app` — **172 files, 62 MB**, under
    `intake/` (63) and `orders/` (108). Mostly PDFs and photographs of licenses.
  - These are the student documents the enrollments portal has been reporting as
    "Missing". They were never missing; the portal was pointed at a project name that
    does not exist.
- Contains personal student data (PII): never copy its contents into files in this repo,
  and never onto a shared link. Read it, show it on Daniel's machine, leave it there.

## The website (healingoasis.edu)

- Currently on Webflow, being migrated to a self-hosted static site by Dan.
- Website changes are Dan's lane for now: `/ask-dan`.

## Prototyping tools

- Node + pnpm for local prototypes in `apps/`. Everything local, nothing auto-deploys.
