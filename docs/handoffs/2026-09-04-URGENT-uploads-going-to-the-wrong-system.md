# URGENT — Dan: every student's uploaded document is going to the wrong system

**This is losing student records right now.** Please read before anything else on the list.

## What is happening

The Shopify enrolment form uploads a student's licence, diploma and reference letters to:

    https://admin--healing-io.us-central1.hosted.app/api/intake/upload

That is the old backend, which is not in Daniel's `healing-oasis` project. The portal he uses records
the file's path against the order and then cannot find the file, because it never arrives in his
storage. In the admin this reads as **"This file can't be opened on this computer"**.

Evidence, from the live systems rather than inference:

- Every object under `intake/` in `healing-oasis` storage was written at `2026-08-29T16:45:31Z` —
  one bulk copy, 38 files. Nothing has been written since.
- `/api/intake/upload` on `admin--healing-oasis` has been called exactly twice in thirty days, both
  of them my own security probes on 3 Sep.
- Noelani Reinker enrolled at 03:44 on 4 Sep. Her order carries
  `intake/a0cc1ba6741c4d7e9d13e856fbe0962d/1788493426416-vet_license.JPG`. No such object exists,
  and no such folder exists.

So every student who has signed up since 29 August has had their paperwork delivered to a system
Daniel cannot see, and the school has no copy of it.

## The Shopify half, which Daniel can have done immediately

Three references in the live theme **Healing Oasis** (`gid://shopify/OnlineStoreTheme/175943254382`):

| file | what it is |
|---|---|
| `templates/product.form.json` | the live setting the enrolment form actually posts to |
| `sections/program-form.liquid` line 557 | the default behind that setting |
| `layout/theme.liquid` line 424 | the chat widget's script |

Each needs `admin--healing-io` → `admin--healing-oasis`. Nothing else changes. I have not touched
the live theme; Daniel is deciding whether I make the change or you do.

## The half that is yours

`healingoasis.edu` — served by Caddy behind Cloudflare, so outside Shopify and outside my reach —
also loads `https://admin--healing-io.us-central1.hosted.app/widget.js`. That wants the same change.

And the files already uploaded to `healing-io` since 29 August need copying into
`gs://healing-oasis.firebasestorage.app/intake/` under the same paths, or those students'
documents are simply gone from the school's point of view.

Then please retire `admin--healing-io`. While it is up there are two front doors to the same
records, and this is the second time it has caused real harm.

## Everything else on the portal is fine

There is now an hourly system check (`/api/health`) that verifies the store answers, the invoices
are readable, every document actually opens, the database refuses anonymous reads and writes, files
are not public, and backups exist. Run against the live school it found exactly one fault — the
missing licence above — which is how this was traced.
