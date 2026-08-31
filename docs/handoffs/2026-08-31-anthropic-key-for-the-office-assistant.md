# The office assistant needs an Anthropic key

## What was built

"Ask" — a new place in the enrollment portal's Console rail where the office can type a
question about the school's own records and get an answer. Branch `prototype/accounting`
on `github.com/healingoasis/portal`, commit `c39ccef`.

- `apps/admin/lib/ask/tools.ts` — seven read-only lookups over `loadStudents()` and
  `loadRoster()`: the whole school, one class, one person, who owes, the money (with a
  month breakdown), the paperwork queue, and who left.
- `apps/admin/lib/ask/system.ts` — instructions, cached as a fixed prefix.
- `apps/admin/app/api/ask/route.ts` — streaming manual tool loop, `claude-opus-5`,
  adaptive thinking, low effort.
- `apps/admin/components/ask-panel.tsx` — the panel, wired into the rail under Dashboard.

Every lookup was checked against live data and ties out to the dashboard: 98 students,
VSMT $139,700 collected, $16,488 outstanding across 3 students, VSMT Fall 2026 showing
12 in the class from the master sheet with 1 withdrawn.

## What is blocking

**There is no Anthropic API key on Daniel's machine**, and none in
`apps/admin/.env.local` (which holds only `LOCAL_DATA`, `SHOPIFY_CLIENT_ID`,
`SHOPIFY_SECRET_KEY`). The `ant` CLI is not installed either. So the assistant can read
everything and think nothing.

It fails honestly rather than mysteriously — the panel says the key is missing and that
it is one for you, instead of showing a generic error.

**What is needed:** `ANTHROPIC_API_KEY` in `apps/admin/.env.local` for local work, and
whatever the deployed portal uses in its own environment. The site chat next door
(`app/api/chat/route.ts`) already constructs `new Anthropic()` the same way, so if the
deployed portal has a key configured, this needs nothing new there.

## Design notes worth keeping

- **Read-only by construction.** There is no write path in the tool set at all, rather
  than a write path guarded by a flag. That is deliberate until there is somewhere
  durable to write to.
- **Grounding.** The model receives no student data except through tool results, and
  every total is computed in the tool. It is never asked to add money up itself.
- **Two truths, kept apart.** The system prompt states that the roster decides class
  membership and the store decides money, and tells it to say so when the two disagree
  rather than picking one.
- **Privacy.** Raw tool payloads never cross to the browser — only the answer text and
  labels like "Reading the VSMT · Fall 2026 roster".
- **Caching.** The system prefix is fixed and cached; nothing volatile goes in it.

## What comes next, and what it needs from you

Layers two and three of this idea are already blocked on the same thing as everything
else in `2026-08-25-portal-storage-and-scopes.md`:

- **"Received a check from X for $Y, check #1234" → recorded.** Needs durable storage.
  This is the four-stage check lifecycle already named in that handoff as the most used
  workflow in the whole workbook.
- **Drop a document → filed against the right student.** Needs Firebase for the files.
  The matching half largely exists already in `rosterMatch`.

Daniel's own rule for both, and it should survive into the build: the assistant proposes
and waits for a yes before writing anything, and records which member of staff said it.
