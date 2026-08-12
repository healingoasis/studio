# What this workspace can reach

Plain-language inventory of the connected tools. "Wired" means Dan has set it up on
this machine (env vars in `.env.local`, CLIs installed). Check with
`bash scripts/check-env.sh`. If something is not wired yet, use `/ask-dan`.

## The Shopify store (healing-oasis-us.myshopify.com)

- [ ] Wired on this machine
- Daniel is the store owner. The store runs programs, CE seminars, the conference,
  merch, and bales. Purchases for programs go through a custom multi-step form.
- Once wired: the agent can read products, orders, and customers, and can make
  changes through the Admin API. **Any change to the live store still needs
  Daniel's clear yes, and structural changes go through Dan.**

## Firebase (project: healing-io)

- [ ] Wired on this machine
- Private storage for enrollment applications and signatures. Contains personal
  student data (PII): never copy its contents into files in this repo, prototypes
  get fake sample data instead.

## The website (healingoasis.edu)

- Currently on Webflow, being migrated to a self-hosted static site by Dan.
- Website changes are Dan's lane for now: `/ask-dan`.

## Prototyping tools

- Node + pnpm for local prototypes in `apps/`. Everything local, nothing auto-deploys.
