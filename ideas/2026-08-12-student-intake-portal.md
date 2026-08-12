---
name: Student intake portal
status: prototyping
created: 2026-08-12
---

## What it is

A place where an enrolled student can log in and see, in real time, exactly where they
stand — both on paperwork and on money. Every document the program requires is listed
with a color: **red** means we have nothing yet, **yellow** means it is in progress,
**green** means it is good to go, and **orange** means what we have is expiring or out
of date and they need to send a new one (this is mostly professional licenses and
insurance).

The same page shows what they have paid and when, and what is still owed. If they want
to pay the balance, they can do it right there through our checkout. And while they are
in there, they can also buy merchandise, CE seminars, or another program.

The office side of it is the same information for everybody at once, so staff can see at
a glance which students are missing paperwork before a class starts.

## Who it helps

Students, who stop having to email and ask "did you get my license?" — and the office,
who stops fielding those emails and chasing paperwork by hand before every module.

## What "working" looks like

- A student can answer "what do you still need from me, and what do I still owe?"
  without calling the school.
- Staff can pull up a class and instantly see who is not ready.
- Nobody starts a module with an expired license, because it turned orange in advance.
- Some payments arrive without anyone having to ask for them.

## Open questions

- The exact list of required documents needs Daniel's eyes — the mockup uses a sensible
  draft list that should be corrected.
- Does the document list differ between VSMT, VMRT, and Acupuncture?
- Who is allowed to move a document to green — any staff member, or specific people?
- How do students actually send documents in today? (Email, portal upload, mail?)
- Real version needs a login and a place to store files; that is a Dan conversation
  since it involves student PII.

## Log

- 2026-08-12: idea captured, mockup built with real program names and prices from the store
- 2026-08-12: turned into a real local web app in `apps/student-intake-portal/`. It now
  reads 39 actual students out of Shopify — who they are, which program and class, what
  they paid and when, what is still owed — and sorts them into nothing paid / deposit
  only / part paid / paid in full. Paperwork colours are still invented. Still needs
  Daniel's corrections to the document list.
