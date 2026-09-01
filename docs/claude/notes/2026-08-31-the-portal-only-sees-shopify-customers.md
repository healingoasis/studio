---
name: The portal only sees students who paid through Shopify
created: 2026-08-31
---

## What Daniel spotted

"There are other students and they aren't under VAc — I believe there are 5 or 6 total in
the acupuncture program." He was right. The portal showed 3. The master sheet has 5.

## Why

**The enrollments list is a list of Shopify customers, not a list of students.** Everyone
in it is there because they placed an order. Anyone who paid another way does not exist in
the portal at all.

Of the five acupuncture students, three paid through the store and **two paid entirely by
check** — deposit and balance both — so they had no order and no row. A third paid a
faculty rate by check as well.

That is not an acupuncture problem. It is the shape of the whole portal, and it is why the
roster exists: the master sheet is the authority on who is in a class, and the store is
the authority on money. Where the roster is loaded, the portal is right. It was loaded for
VSMT and VMRT and **not for Acupuncture**, so acupuncture had nothing to correct it.

## What was done

The Acupuncture Fall 2026 master sheet ("Acupuncture Fall Master" in Drive, last touched
the morning of 31 Aug) was read into `.rosters.local.json`. The class now reads:

- **5 in the class**, not 3
- **3 of 5 matched to a payment** — stated plainly, rather than hidden
- 4 of 5 have a degree, 5 of 5 have a state, so the name tags print
- $10,401 collected, $7,900 outstanding from one student

## What this says about the 21 "no class" students

Daniel guessed they were old payments from before the Shopify site went live. **Half
right.** Sorted by date, the unplaced VSMT/VMRT/Acupuncture orders split cleanly:

- **Eight from April 2025 to January 2026** — before the site. Four of them are large
  balances ($8,467, $8,467, $8,189, $7,175). These are the legacy group he described.
- **Eleven from May 2026 onward**, including a $8,674 VSMT balance in June, an $8,376
  acupuncture balance on 19 August and a $1,265 installment on 29 August. These are
  current students, and they are unplaced for a different reason: **the product they
  bought is named generically** — "VSMT Program Balance", "Acupuncture Program Balance" —
  so nothing on the order says which intake. That is ongoing, not historical.

Three of them are not enrolments at all: "VSMT Adjustment" ($211, $52.75) and "VSMT
Canine" ($52.75) are clinic treatments being counted as VSMT students because the title
contains "VSMT".

## Worth doing

1. **Load the remaining master sheets.** Every programme with a roster is right; every one
   without is guessing from product titles.
2. **Name the class in the product title**, the way "VSMT Fall 2026 - Remaining Balance"
   already does. It costs nothing at the point of sale and places the student for free.
3. **Separate clinic services from programme sales** in the store, or teach the portal that
   "Adjustment" and "Canine" are treatments.
4. **Deanna Witte's $7,900.24** — the single real outstanding balance in the whole school —
   is a check on the way per the master sheet. That is exactly the check-tracking workflow
   waiting on Dan.
