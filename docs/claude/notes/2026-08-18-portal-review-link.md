---
title: What it takes to publish the portal as a link
date: 2026-08-18
---

The student intake portal is a Next.js app that reads live students from Shopify. Daniel
wanted a link he could open and share. Getting there needed two separate things: keeping
real people out of it, and making a server-rendered app run as one published file.

## Keeping real people out

The page shows names, emails and balances read from the store at request time, and
`public/photos/` holds photographs of identifiable students, staff and clients (gitignored
deliberately — this repo is public). Daniel's call was **real photographs, invented
students**.

So the review build swaps only the people: `PORTAL_DEMO=1` makes `load_students()` read
`lib/demo_students.ts` instead of Shopify, and makes `load_records()` return nothing so no
real uploaded paperwork attaches. The demo data is a list of *orders*, not finished
students, so it runs through the same `students_from_orders` pipeline as the real thing —
the card fee coming back out, the standings, the payment history all behave as they do
live. Shop shelves stay real: they come from the store's public `products.json`, which is
published catalogue data.

`app/review/` is a single page holding both versions, because two addresses cannot exist
in one published file. `VersionSwitch` drives React state through the `ReviewSwap` context
instead of the router when that context is present.

## Making it run as one file

Four things had to be solved, each of which looked like "the page is just dead":

1. **It needs its own document.** The app hydrates the whole document, and the publishing
   host injects its own runtime into the page's head. React will not hydrate around
   foreign tags, so the app must sit in a frame of its own.
2. **The frame must load from a blob, not `srcdoc`.** `about:srcdoc` gives the document no
   address; the router never finishes starting and nothing on the page reacts. There is no
   error — it just sits there.
3. **`next/link` has to go.** Link prefetches by resolving each target against the current
   page, and a blob address cannot be resolved against, so every link on the page throws
   and takes the app down. `next.config.mjs` aliases it to `app/review/plain-link.tsx`
   under `PORTAL_DEMO`. Clicks on those anchors are caught in `review-shell.tsx`.
4. **`history.pushState`/`replaceState` have to be stubbed.** The router writes the address
   bar as it goes; a blob document is not allowed to, and it throws rather than returns.
   This one only shows up on the *first version switch*, not on load.

Two smaller ones: a literal U+FFFD inside a Next polyfill makes the publisher reject the
file as corrupt (escaped instead), and `theme-preview.tsx` touched `localStorage` without
a guard, which throws inside a sandboxed frame and took the whole app down with it — that
guard is a genuine fix, not a packaging trick.

`scripts/build-review.sh` does the whole cycle. `--trace` puts any error on the page
itself, which is the only way to see one: the published copy runs in a frame whose console
is out of reach from outside.

## What the link is not

Not a working app. No uploads, no live store reads, no document actions — those need the
server. It is the real interface with believable data in it.
