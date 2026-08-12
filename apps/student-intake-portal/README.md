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

**Invented:** every document status. Nothing tracks paperwork today, so there is nothing
to read. Statuses are generated from a hash of the customer id, biased by how far along
they are on payments, so a given person always shows the same thing instead of
reshuffling on each load. See `lib/documents.ts`.

The required-document list in `lib/documents.ts` is a **draft** and needs Daniel to
correct it against what the programs actually require.

## Student data never lands on disk

Names, emails, and orders are fetched server-side per request and rendered. Nothing is
cached to the filesystem, written to this repo, or committed. The page is
`force-dynamic` and `isrFlushToDisk` is off so Next cannot write a copy either.

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
lib/env.ts        reads .env.local from the repo root (Next only looks in the app folder)
lib/shopify.ts    swaps app credentials for a short-lived token, runs Admin GraphQL
lib/students.ts   turns orders into one row per person, works out standing and balance
lib/documents.ts  the pretend paperwork
app/page.tsx      server component, fetches, handles failure in plain language
app/portal.tsx    the whole interface
mockup.html       the original static mockup, kept for reference
```

## Not built yet

Login, document upload, storage, writing anything back to Shopify. All of that needs a
place to put student files, which is a Dan conversation because it holds PII.
