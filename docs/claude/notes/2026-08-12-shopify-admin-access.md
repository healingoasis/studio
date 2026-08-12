# The Shopify credentials do reach the Admin API — and they can write

Date: 2026-08-12

## What was assumed

`docs/handoffs/2026-08-12-shopify-access.md` recorded that `.env.local` holds
`SHOPIFY_CLIENT_ID` and `SHOPIFY_SECRET_KEY`, and the working assumption was that OAuth
app credentials cannot query the Admin API without an interactive install flow.

## What is actually true

They can. Shopify's **client credentials grant** works for this app:

```
POST https://{store}/admin/oauth/access_token
{ "client_id": …, "client_secret": …, "grant_type": "client_credentials" }
```

returns a short-lived Admin API token directly, no browser round trip. That is what
`lib/shopify.ts` in the student intake portal uses. The secret is **not** usable as an
access token on its own, and basic auth does not work — both return 401.

## The part that matters

The returned scope list is far broader than the read-only set the handoff asked for. It
includes, among others:

```
read_all_orders, read_analytics, write_customers, write_checkouts,
write_price_rules, write_discounts, write_files, write_locations,
write_channels, write_metaobject_definitions, …
```

So this app can **change the live store**, not just read it. That is worth Dan knowing,
since the intent recorded in the handoff was read-only to start.

Nothing in the studio writes to Shopify, and nothing should without Daniel's clear yes
per `AGENTS.md`. But the guard rail is currently convention, not permissions. Options
for Dan: narrow the app's scopes to the read-only set, or leave it and rely on the rule.
Worth an explicit decision either way rather than drifting.

## Small correction for docs/tools.md

`docs/tools.md` shows Shopify as not wired. It is wired, for reading, right now.
