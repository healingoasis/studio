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

---

## Added 5 Sep — it is worse than student self-uploads

Daniel has told me that the old portal has a feature you built for him: a place to **drop documents
onto each student by hand**. Students email their licence, diploma and reference letters to the
office, and he has been filing them that way — in his words, "a shit ton" of them.

Every one of those went into `healing-io`, not `healing-oasis`. So the missing paperwork is not only
the self-uploads since 29 August; it is months of documents the office filed deliberately, one at a
time, believing they were being kept.

I cannot see any of it. `daniel@healingoasis.edu` has no access to `healing-io` at all —
`gcloud projects list` returns only `healing-oasis`, and listing that project's buckets is refused
outright. Only you can do this.

### What is needed, precisely

1. **Copy the whole storage bucket across**, preserving object paths exactly — the portal looks
   files up by path, so a renamed object is still a lost one:

       gcloud storage rsync -r gs://<healing-io bucket> gs://healing-oasis.firebasestorage.app

   The paths that matter are `intake/**` and anything the manual drop feature wrote.

2. **Copy the Firestore records that point at them.** The file bytes alone are not enough: the new
   portal reads a per-order paperwork record (collection `orders`, and whatever the drop feature
   wrote in `healing-io`). If those records only exist over there, the files will land in storage
   with nothing referring to them. Please send me the shape of what that feature wrote and I will
   map it in — I do not need access, only the field names.

3. **Retire `admin--healing-io`** once both are copied, so nothing can be filed into it again.

### How we will know it worked

The portal now runs its own checks every hour, and one of them fetches every document it believes
in. It currently reports:

    Every document opens — 1 of 66 are recorded but not in storage: Noelani Reinker: vet license.JPG

When the copy is done that check goes green, and the count of documents will rise well above 66.
Daniel can see this himself on the **Checks** screen in the portal.

### What is already fixed on this side

Two students in VSMT Fall 2026 — Brenna Wetherbee and Erica Nelson — appeared to have no documents
at all. Their fifteen files were in `healing-oasis` the whole time, attached to a second order that
names no class, so the class folder never showed them. That is fixed: paperwork now follows the
student rather than the order. It is not related to the `healing-io` problem, and it does not reduce
what still has to be copied.
