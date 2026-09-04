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

- ~~The exact list of required documents~~ — answered 2026-08-12 from Daniel's
  admissions comparison document. The lists differ by program and are now in
  `apps/student-intake-portal/lib/documents.ts`.
- Several requirements only apply to some applicants (the non-vet waiver, the
  final-semester student waiver, the out-of-North-America paperwork, the NBCE score for
  chiropractors on Acupuncture). Knowing which apply means knowing each applicant's
  credential, which Shopify does not hold. Where does that come from — the application
  form in the portal?
- Cranio/Sacral has admissions requirements too, so it is treated as a fourth program
  here even though the store sells it as an event ticket. Is that right?
- Who is allowed to move a document to green — any staff member, or specific people?
- How do students actually send documents in today? (Email, portal upload, mail?)
- Real version needs a login and a place to store files; that is a Dan conversation
  since it involves student PII.
- The existing enrollments portal (`github.com/healingoasis/portal`) already handles
  applications, signatures and documents. This may belong there rather than here.

## Log

- 2026-08-12: idea captured, mockup built with real program names and prices from the store
- 2026-08-12: turned into a real local web app in `apps/student-intake-portal/`. It now
  reads 39 actual students out of Shopify — who they are, which program and class, what
  they paid and when, what is still owed — and sorts them into nothing paid / deposit
  only / part paid / paid in full. Paperwork colours are still invented. Still needs
  Daniel's corrections to the document list.
- 2026-08-12: Daniel supplied the real admissions requirements (Healing Oasis Admissions
  Requirements Comparison, covering VSMT, VMRT, Acupuncture and Cranio/Sacral). The
  document lists are now real and differ per program, and a neutral grey "not needed"
  state was added for requirements that only apply to some applicants — Daniel's four
  colours still mean exactly what he said they mean.
- 2026-08-12: documents can actually be uploaded now. A file sent against a requirement
  is saved on the Mac, turns that requirement yellow, and can be opened, replaced or
  removed. Status changes stick too. Next real blocker is a login — without one there is
  nothing separating one student's documents from another's.
- 2026-08-18: shareable review link published — both versions in one page, with
  invented students in place of the real ones. Notes in `docs/claude/notes/`.
- 2026-08-31: the office view became folders. Opening a program shows its classes and a
  separate Admin Documents folder. The first document is real: the desk name tags, drawn
  to match Daniel's own "NAME ID for the Table.pdf" exactly — same 11 x 8.5in landscape
  page, same positions, one page per student, a Print button that prints the class as it
  stands. A student who withdraws or moves to the next intake comes off the list straight
  away. Three things the store cannot answer are now typed by the office and stick:
  degree, state, and a real name where Shopify holds a clinic ("Whitewater Hospital") or
  half a name ("null Kasten"). 13 of the 32 VSMT students bought without naming a class
  and wait in a holding folder to be placed. A live test product was quietly adding a
  16th student to the Fall class; it is filtered out now. The diploma has a slot waiting
  for Daniel's file.
- 2026-09-01: Daniel asked for Firebase access and sent the console link. It points at a
  project named `healing-oasis`; this repo has always been set up against `healing-io`.
  Written up in `docs/handoffs/2026-09-01-firebase-access.md` — the project name needs
  settling before a key is issued. Status stays `prototyping`: the storage-and-login
  question is with Dan, but the rest of this idea is not waiting on him.
- 2026-09-04: tuition now shows the card fee broken out. Daniel spotted that the portal's
  figure did not match the store: the store's prices are all tagged `cc-fee-included`, so
  $6,399 for VMRT is $6,189 of tuition plus 3.4%. The tile now reads tuition, the fee, and
  the card total, which reconciles to the store exactly for all four programs. VMRT and
  VSMT match the tuition published on healingoasis.edu; Acupuncture ($8,100) and
  Cranio/Sacral ($660) are worked back out of the store price because the site does not
  publish them — worth Daniel confirming.
- 2026-09-04: added a "Start Student Portal" launcher to the Desktop. Servers started from
  a Claude tool call die when the call ends; one started from Terminal belongs to Daniel
  and stays up.
