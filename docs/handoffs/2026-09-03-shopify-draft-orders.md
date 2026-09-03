# Dan: one Shopify permission, and the portal reads the invoices

**One tick in Shopify.** Everything on this side is already built and waiting.

## What is needed

The store's app needs the `read_draft_orders` scope. Today the portal asks for draft orders and
gets `ACCESS_DENIED`, which I have confirmed against the live store rather than assumed.

In Shopify: **Settings → Apps and sales channels → Develop apps** → the app the portal uses →
**Configuration → Admin API access scopes** → tick **`read_draft_orders`** → Save → install the
updated app when prompted.

Shopify does not let an app widen its own access — that is the point of scopes — so this cannot be
done from the portal or from any API. It needs somebody with the store's admin.

## Why it matters

Draft orders are the invoices the office raises for work bought outside the checkout: an adjustment
on a farm call, a bale over the phone, a place held while somebody arranges payment. Until one is
paid it is not an order, so none of it reached the portal. Daniel has an adjustment he has invoiced
three times that has been invisible here while sitting plainly in Shopify.

The school's own conference sheet also lists a `#D44` exhibitor at $2,000 marked "Invoice Sent",
which is a draft order the portal cannot currently see.

## What happens when you tick it

Nothing else. There is an **Invoices** screen in the rail — who was invoiced, for what, how much,
when it was last emailed, and what is still unpaid. It reads `draftOrders` live, and until the scope
exists it shows the instructions above rather than an empty page that looks like nobody owes
anything. Ticking the box is the whole change; the invoices appear on the next look.

`apps/admin/lib/shopify-drafts.ts` if you want to see what it asks for. It reads only — nothing
here creates, sends or completes a draft.

## Still outstanding from before

- **Individual logins.** The whole school signs in as `info@healingoasis.edu`. Diplomas are meant to
  be visible only to Daniel and the Director, and the new change history records who did what —
  neither means anything while one shared account is all there is. `daniel@healingoasis.edu` has no
  Firebase Auth account; it is already on both allowlists and starts working the moment it exists.
- **The `admin--healing-io` backend** is still live under an account that is not Daniel's, serving an
  older build. Two front doors to the same student records.
