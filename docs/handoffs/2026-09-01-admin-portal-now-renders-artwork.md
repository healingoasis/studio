# The admin portal now redraws artwork on the server

**For Dan — worth five minutes at tomorrow's meeting.** Nothing here is blocked on you; this is
so you are not surprised by it.

## What changed and why

Marketing corrections — a teammate fixing a word on an approved ad and everyone downloading the
newest version — only ever worked on Daniel's Mac. The rendering path was written against a
laptop: the browser was the Chrome in `/Applications`, the thumbnail came from `sips`, the campaign
source was a folder on disk, and the corrected file was written back into it. Deployed, a teammate
clicking the pencil was told the piece "came to us as a finished picture, without the words behind
it", which is a statement about the artwork and was not true of it.

It now works on the deployed backend. Verified end to end there: a slide rebuilt with corrected
wording, photographs and fonts intact, 1080x1350, about thirteen seconds.

## The three things you would want to know

**1. A browser runs in the App Hosting container.** `@sparticuz/chromium` (pinned to 123.0.1) plus
`puppeteer-core`. `lib/browser.ts` is the only place that decides where a browser comes from, and
the theme preview — which had the same Mac-only assumption and the same silent failure — now shares
it.

**2. Shared libraries are vendored into the repo.** This is the part worth a look:
`apps/admin/vendor/chromium-libs/`, about 4MB, the Ubuntu 22.04 builds of libnspr4 and libnss3.

Chromium cannot start without the NSS/NSPR family. The App Hosting container is Ubuntu 22.04 with
none of it installed, the serverless Chromium package only ships some of it (it assumes an AWS
Lambda host provides the rest), and the buildpack build runs unprivileged so there is no apt to
reach for. The libraries are matched to the container's own glibc — 2.35 — rather than merely
close to it, and `next.config.ts` names the directory in `outputFileTracingIncludes`, without which
the bundler drops them, since nothing imports a shared object.

**If App Hosting ever moves to a newer Ubuntu, these need refreshing to match.** That is the one
maintenance cost this introduces, and it is written down in the folder's README.

The alternative was a second Cloud Run service built from a Dockerfile with a real Chrome in it.
That is the more orthodox answer and it is what to reach for if the vendored libraries become
annoying — but it is a whole extra service for Healing Oasis to run and for you to maintain, to do
one job that now fits in the service they already have.

**3. The container got bigger:** 2 CPU, 2GiB, 300s timeout. A browser holding a 1080x1350 page does
not fit in half a gigabyte on a shared core. It still scales to zero.

## Also fixed today, same repo

- **The live portal was reading stale data.** `LOCAL_DATA=shopify` meant both "read the real store"
  and "skip the session cookie", so the deployed portal fell back to the `orders` collection in
  Firestore: 76 documents, stale, and with no `total_received` on any of them — the field every
  money figure is built on, so the whole site read as though nobody had paid. Now two separate
  switches: `ORDERS_SOURCE` (where data comes from) and `LOCAL_DATA` (local auth bypass, never set
  on a deployed backend).
- **A student was missing from her own class.** On the master sheet as Jaqueline Pozdol at her
  practice address, in the store as Jacquelin Pozdol at a personal one. Matching now tolerates a
  differently spelled first name when the surname is unique on the programme. The comparison is in
  `lib/name-match.ts` with its own tests — it is the one rule that can attach real money to the
  wrong real student.
- Design files and campaign photographs are published to Cloud Storage alongside the artwork
  (`scripts/publish-data.mjs --marketing`), because the renderer needs them to rebuild a piece.

## Still yours

- `read_draft_orders` is not granted on the Shopify app, so Daniel's chased invoices are invisible
  to the portal.
- There is a second App Hosting backend at `admin--healing-io` serving a different, older build.
  It is not in Daniel's project. If it is in one of yours, it should go — until it does there are
  two front doors to the same student records.
