---
name: Cohort folders and admin documents
idea: 2026-08-12-student-intake-portal
created: 2026-08-31
---

## What Daniel asked for

In the office view, clicking a program (VSMT as the example) should open into
subfolders: the classes themselves (Fall Class, Spring Class) and a separate
**Admin Documents** folder. Admin Documents holds preset office paperwork that can be
downloaded or printed. The first is the desk name tags. The list must stay accurate to
the exact class — someone who drops or moves to the next intake comes off it — so that
three days before a module he can click once and print.

Daniel supplies the real documents. The build has to be a shelf they drop into.

## What the live store actually gives us

Read 31 Aug 2026 from healing-oasis-us.myshopify.com, 46 students on a program:

| Program | Fall 2026 | Spring 2027 | No class on the order |
|---|---|---|---|
| VSMT | 16 | 4 | 13 |
| VMRT | 4 | — | 2 |
| Acupuncture | 1 | — | 2 |
| Cranio/Sacral | — | — | 4 |

Three things follow from that:

1. **The class term is guessed from the product title.** "VSMT Fall 2026 - Remaining
   Balance" places someone; "VSMT Program Deposit" does not. 21 of 46 people cannot be
   placed automatically. The office has to be able to put them in a class by hand.
2. **Nothing in Shopify records a drop or a move.** A student who withdraws still has
   their orders. Enrolment state has to be office-set.
3. **A test product is live** — "LAB — VSMT Fall 2026 (TEST — do not buy)". It must be
   excluded or a fake student prints a name tag.

## The name tag, measured from Daniel's file

`NAME ID for the Table.pdf`, one landscape page, 792 × 612 pt (11" × 8.5"),
Bookman Old Style throughout, text centred on the page at x = 396:

| Element | Size | Baseline (from bottom) |
|---|---|---|
| First name | 72 pt | 284.95 |
| Last name, Degree | 36 pt | 234.41 |
| State | 12 pt | 214.85 |

The Healing Oasis logo sits left, 124.6 × 144.6 pt at (76.9, 185.5), on a white block.
One page per student. This format is the same for every program and every CE seminar,
so it is one template, not one per program.

**Data needed per card:** first name, last name, degree, state.
Shopify supplies the names and the state (present on 58 of the last 60 orders).
**Degree is nowhere in the store** — the office enters it once per student and it sticks.
Names need correcting too: the store holds "Whitewater Hospital" and "null Kasten"
where a person's name should be.

## What gets built

- **`lib/roster.ts`** — groups students into program → class, applying office overrides.
- **An office record per student**, saved on this Mac in `.data/office-roster/`, exactly
  like the document uploads: which class they are in, whether they are active, dropped
  or moved to a later class, their degree, their state, and a corrected display name.
  Nothing is ever written back to Shopify.
- **`/office/[program]`** — the folder view: one card per class, plus Admin Documents.
- **`/office/[program]/class/[term]`** — the class itself, where the office assigns,
  drops and moves people, and fills in a degree.
- **`/office/[program]/docs`** — the Admin Documents folder.
- **`/office/[program]/docs/name-tags`** — the print sheet, one page per active student
  in that class, matching the measured layout, with a real Print button.
- **A slot for documents Daniel has not sent yet** — the diploma is next. Each slot
  shows what it needs and accepts a dropped file, so the folder is visibly waiting
  rather than silently missing.

## Deliberately not in this pass

- The diploma layout, until Daniel sends the file.
- Anything that writes to the store.
- Certificates, sign-in sheets, contact lists — only if Daniel asks for them.
