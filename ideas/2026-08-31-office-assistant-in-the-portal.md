---
name: An assistant inside the admin portal
status: shaping
created: 2026-08-31
---

## What it is

A place inside the admin portal where the office team can just type. Two jobs, and
eventually three.

**Ask it anything.** "Who still owes for Fall 2026?" "How much came in last month?"
"Who is missing paperwork before the module starts?" "What did we invoice Whitewater?"
It reads what the portal already reads and answers in a sentence, so nobody has to know
which screen holds the answer.

**Tell it things.** "Received a check from Penny Farmer for $8,189, check #1234." It
works out who and which class that belongs to, says back what it is about to record,
and waits for a yes before writing it down.

**Hand it documents.** A licence or an insurance certificate arrives by email; drop it
in, and it works out whose it is and files it against the right requirement.

## Who it helps

The office, every day. It replaces "which screen was that on" and a lot of the retyping
that currently goes into the Google Sheets workbook. Daniel indirectly, because the
answers stop coming through him.

## What "working" looks like

- Somebody who has never been shown the portal can still get an answer out of it.
- A check gets recorded in one sentence instead of a hunt for the right row.
- Nothing is ever written without the team seeing what it is about to write.
- Every entry says which member of the team said it, so a mistake is traceable.

## How it gets built, in layers

1. **Ask anything.** Read-only, over the live store and the class rosters. Nothing new
   has to be stored, so this is buildable now. **Starting here.**
2. **Logging checks and payments.** Needs somewhere durable to write — the same blocker
   as everything else on `docs/handoffs/2026-08-25-portal-storage-and-scopes.md`, where
   Daniel's four-stage check lifecycle (invoiced → on the way → received → paid in full)
   is already named as the most used workflow in the whole workbook.
3. **Filing documents.** Needs Firebase for the files themselves. The matching half is
   largely written already: `rosterMatch` in the portal places a person from a name or an
   email and is careful about a clinic paying on a student's behalf.

## What already exists to build on

The portal has a working streaming chat with tool-calling (the public site assistant, in
`apps/admin/lib/chat/` and `apps/admin/app/api/chat/route.ts`). It uses a manual tool
loop so raw data never crosses to the browser — only text and the *names* of what was
looked up. Same engine, pointed at the office instead of prospective students.

## Rules this one has to follow

- **Read freely, write only on a yes.** Money and student records are where a confident
  wrong guess is expensive.
- **Never invent a number.** Every figure comes from a tool result, not from the model's
  memory of the conversation.
- **Real student data stays on the machine**, exactly as the rest of the portal works.

## Open questions

- Where does it live — a rail item, or something that opens over any screen?
- Does the whole team get it, or the office only? (Bears on the audit trail.)

## Log

- 2026-08-31: idea captured from Daniel. Decided to build layer 1 (ask anything) now and
  leave 2 and 3 until the storage work with Dan lands.
