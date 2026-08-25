# Portal: durable storage, draft-order scope, and Firebase documents

## What Daniel wants

The enrollments portal to be the one place the office works from, replacing the
Google Sheets workbook (`Accounting/Healing_Oasis_Master_Orders`) that is currently
rebuilt by hand from CSV exports each week.

It is most of the way there. Running locally against the live store
(`LOCAL_DATA=shopify`), it now shows every student, every class, the money side in
full, and an Accounting page that ties to Shopify to the penny. Branch:
`prototype/accounting` on `github.com/healingoasis/portal`.

Three things stop it replacing the workbook, and all three need you.

## What is blocking

**1. Nothing survives a restart.** Admissions decisions, grades, evaluations and
diplomas are held in the dev server's memory (`apps/admin/lib/admissions-store.ts`,
`apps/admin/lib/progress-store.ts`, both say so in their own comments). Mark a
requirement "Good to go" and it is gone tomorrow.

This also blocks two things Daniel has specifically asked for:

- **Check tracking.** His workbook runs a four-stage lifecycle Shopify has no concept
  of: `invoiced → check on the way → check received → paid in full`. It is the most
  used workflow in the whole sheet. Recording "check for $8,189 mailed by Penny
  Farmer on 8/20" needs somewhere real to live.
- **Withdrawals.** A student who withdraws should drop off the class paperwork
  automatically. The `stopped` status already exists in `apps/admin/lib/progress.ts`
  but forgets itself, so nothing downstream can rely on it.

**2. Draft orders are refused.** The workbook tracks **$20,788.80** of invoices sent
but not yet paid. Asking Shopify for them returns:

```
Access denied for draftOrders field. (ACCESS_DENIED)
```

The app's scopes do not include draft orders.

**3. Student documents cannot be opened.** The portal knows *what* each student sent
— that list comes through from checkout — but the files themselves are in Firebase
Storage and this instance has no credentials, so every requirement on the Admissions
tab reads "Missing" even for students who did send things in.

## What Dan needs to do

1. **Somewhere durable for office-entered records**, with an audit trail (who changed
   what, when) since it is student PII. Firestore alongside the existing enrollment
   records is the obvious home. Three record types, all keyed by order number:
   - admissions decisions + file-to-requirement assignments (shape:
     `apps/admin/lib/admissions-store.ts`)
   - progress: grades, evaluation, diploma (shape: `apps/admin/lib/progress.ts`)
   - payment state beyond what Shopify knows: check on the way / received, check
     number, and withdrawal with any partial refund
2. **Add `read_draft_orders`** to the Shopify app's scopes so the pipeline can be
   read. Read-only is enough.
3. **Firebase credentials for the portal**, or a decision that student documents stay
   unreachable outside the deployed app. Either answer is workable — Daniel just needs
   to know which, because "Missing" currently looks like a data problem rather than an
   access one.
4. **Review the branch when you have a moment.** `prototype/accounting` also carries a
   fix worth a look: student totals used to be summed from order line items, which
   missed order-level tax, shipping and basket discounts and ran about $340 adrift of
   the store. Line items now decide each student's share and the order's own total
   decides the amount, so the parts add back up to the order.

## Notes

- Nothing invented remains anywhere in the portal — the sample-data mode and all
  sixteen made-up students were removed on Daniel's instruction. It runs on the real
  store or it does not run.
- Real student data stays on Daniel's machine. The local server is bound to
  `127.0.0.1` deliberately, and no real record has been put on any shared link.
- `main` has not moved. Nothing here touches the deployed portal.
