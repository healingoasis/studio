---
name: A marketing shelf in the admin portal
status: prototyping
created: 2026-08-31
---

## What it is

Daniel's words: "when I have you run some advertisements and ads from Claude Code, once
they're done and approved you'd upload them to here in the according folder. Then my team
can click a reel or flyer/post and they can download it to then post."

A **Marketing** tab in the admin portal, with a folder for each program plus CE and the
Conference. Approved advertising lands in the right folder; anyone on the team opens it,
sees the artwork, and downloads what they need. Nothing there edits anything — it is a
shelf, not a studio.

## Who it helps

The office and whoever is posting that week. It ends "can you send me the file again",
and it means finished work stops living only in a folder on Daniel's Mac.

## What "working" looks like

- Somebody who has never seen the portal can find this week's post and get it onto their
  phone or desktop in two clicks.
- A carousel comes down as its six slides, in order, correctly named.
- A folder that has nothing approved in it says so, rather than looking broken.
- Nothing on the shelf can be changed from the portal.

## Where it stands

Built on the `prototype/accounting` branch of the portal repo (commit `4378ef8`):

- `apps/admin/lib/marketing.ts` — the library the portal reads.
- `apps/admin/components/marketing.tsx` — the folders, the grid, and the download sheet.
- `apps/admin/app/api/marketing/file/route.ts` — serves a file, behind the same sign-in
  as the rest of the portal.
- `apps/admin/scripts/import-marketing.mjs` — how approved work gets onto the shelf.

Seeded with the three finished campaigns from this studio — VSMT, VMRT and Acupuncture,
36 carousels and 216 slides. CE and Conference are empty because nothing is approved for
them yet.

## The open question, and it is the same one as everywhere else

The artwork sits in `.marketing.local/` on Daniel's Mac, exactly like the class rosters.
That is right for building and wrong for the point of it: **his team cannot reach a folder
on his laptop.** For this to do its job the files have to live where the deployed portal
can serve them, which is Firebase Storage — the same thing already sitting with Dan in
`docs/handoffs/2026-08-25-portal-storage-and-scopes.md`.

Until then it is fully usable by Daniel and demonstrable to the team, and the loader is
the only piece that has to change.

## Log

- 2026-08-31: idea captured and built the same day. Layer one — the shelf, seeded with
  the three finished campaigns. Reaching the team needs the storage work with Dan.
