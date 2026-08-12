# Shopify store access for the studio

## What Daniel wants

Claude working in the studio to be able to reach the Shopify store
(`healing-oasis-us.myshopify.com`) — reading products, orders, and customers so ideas
and prototypes can be grounded in what is actually happening in the store.

## What is blocking

There is no `.env.local` in the studio folder yet, so nothing is wired.
`bash scripts/check-env.sh` currently reports:

```
No .env.local file yet. Ask Dan for it (see .env.example for what goes in it).
```

Missing: `SHOPIFY_CLIENT_ID`, `SHOPIFY_SECRET_KEY`. (`SHOPIFY_STORE` and
`FIREBASE_PROJECT_ID` already have defaults in `.env.example`.)

## What Dan needs to do

1. Create the Shopify custom app / access credentials for the studio.
   **Read-only scopes to start** — `read_products`, `read_orders`, `read_customers`.
   Daniel's intent is grounding ideas in real data, not changing the live store, so
   write scopes are not needed yet and can be added deliberately later.
2. Fill in `SHOPIFY_CLIENT_ID` and `SHOPIFY_SECRET_KEY` in a `.env.local` built from
   `.env.example`, and send that file to Daniel privately (not through this repo).
3. Confirm whether Firebase (`healing-io`) should be wired in the same pass, or held
   back — it holds student PII, so it may be worth keeping unwired until there is a
   concrete need.
4. Once Daniel has dropped the file in, `bash scripts/check-env.sh` should report all
   four settings present.

Note: `docs/tools.md` still shows Shopify and Firebase as not wired. Worth ticking the
Shopify box there when this lands.

## Setup status on Daniel's Mac (as of 2026-08-12)

- Studio cloned to `~/studio` — done.
- Node 24.19.0 LTS + pnpm 11.21.0 installed to `~/.local/nodejs` (no sudo, `~/.zshrc`
  created to put it on PATH) — done, so `apps/` prototypes can run.
- Claude Code CLI not installed yet, so `claude` is not available in Terminal.
- `.env.local` — this handoff.
