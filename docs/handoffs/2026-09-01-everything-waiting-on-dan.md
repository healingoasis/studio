# One page for the meeting: everything the portal is waiting on

Written 31 Aug 2026 for Daniel's meeting with Dan on 1 September. It replaces nothing —
`2026-08-25-portal-storage-and-scopes.md` and
`2026-08-31-anthropic-key-for-the-office-assistant.md` still hold the detail — but those
two were written weeks apart and neither shows how much now sits behind them.

**Everything below is on `prototype/accounting` at `github.com/healingoasis/portal`,
through commit `0b26613`. Nothing is deployed. Typecheck and 28 tests pass.**

---

## Read this first: the dashboard was overstating what the school is owed

Fixed today, but worth Dan knowing because it is a data-truth problem, not a UI one.

The dashboard said **$16,488 owed across three students**. One student owed money. The
other two were Kite's own:

| Order | Who | Owed | What it actually was |
|---|---|---|---|
| #1114 | a real student | $7,900 | genuine, unpaid Acupuncture balance |
| #1055 | Dan Borgia | $8,388 | refunded order against `LAB — VSMT Fall 2026 (TEST — do not buy)` |
| #1054 | deposit-test@kiteagency.com | $200 | seat-deposit test |

Two separate mistakes underneath it:

1. **Shopify keeps reporting an outstanding balance on a refunded or voided order.** It is
   recording what was never collected, not what somebody still has to pay. The portal took
   it at face value.
2. **Test orders counted as students.** Four of them, inflating the roster and adding about
   $17,000 to Billed.

Both rules now live in `apps/admin/lib/order-truth.ts`, pure and tested — deliberately
not buried in the Shopify client. **Still owed now reads $7,900 from one student, and
Collected does not move.**

**Worth a decision at the meeting:** the test product is still live in the store. The
portal ignores it now, but it can still be bought.

---

## The one thing that unblocks the most: somewhere durable to write

This is the same ask as 25 August. What has changed is how much is now stacked behind it.
**Five separate features are finished except for this.**

| Waiting on storage | What exists today |
|---|---|
| **Check tracking** — invoiced → on the way → received → paid in full | Nothing. Daniel's most-used workbook column. |
| **Admissions decisions, grades, evaluations** | In the dev server's memory. Gone on restart. |
| **Withdrawals** | `stopped` exists in `progress.ts` and forgets itself. |
| **Telling the assistant things** — "received a check from X for $Y, #1234" | The assistant reads well; it has no write path at all, by design, until there is somewhere honest to write. |
| **The marketing shelf reaching the team** | 91 pieces, 271 files, 208 MB — all on Daniel's laptop. |

That last one matters more than its line suggests. The whole point of the shelf is that
the team downloads from it, and today they cannot reach it.

**Also still open from 25 August:** the `read_draft_orders` scope. The workbook tracks
**$20,788.80** of invoices sent and unpaid, and asking Shopify for them returns
`ACCESS_DENIED`.

---

## The second thing: an Anthropic API key

`apps/admin/.env.local` holds only `LOCAL_DATA`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_SECRET_KEY`.
No key anywhere on the machine, and the `ant` CLI is not installed.

Two finished features are asleep without it:

- **Ask** — the assistant bubble. Seven read-only lookups over the live store and the
  class rosters, every one checked against real data and tying out to the dashboard. It
  fails honestly right now: it says the key is missing rather than looking broken.
- **Plain-English marketing corrections** — "it should say hands-on, not supervised".
  The rest of that feature works without a key; only the interpreting half needs one.

The site chat next door already constructs `new Anthropic()` the same way, so if the
deployed portal has a key configured, this needs nothing new there.

---

## What has been built since you last looked

Worth five minutes of the meeting, because it changes what the portal is for.

- **A class opens as its people and its paperwork.** Programme → class → *The class* /
  *Admin Documents*.
- **Desk name tags print the exact class.** Measured from the school's own
  `NAME ID for the Table.pdf` — same 11 × 8.5in landscape page, same baselines, drawn as
  SVG so the type lands identically whatever serif the printer has. Who gets a card comes
  from the master sheet, not from who paid: it includes students whose payment has not
  been matched and excludes anyone who withdrew.
- **Marketing** — 91 approved pieces in folders per programme, plus CE and Conference.
  36 of them can be corrected from inside the portal: the words and layout are data, so a
  wrong word is a text change and a rebuild, always previewed before it becomes the file
  the team downloads.
- **Ask** — the assistant bubble, on both admin screens.
- **Navigation** — one breadcrumb top-left at every level; the logo is the way home.
- **A student who paid from two addresses is one student.** Someone signed up from an
  iCloud address and paid the balance from a Gmail one; the account bucketing had her on
  the VSMT roster twice, once for $200 and once for $8,467. The master sheet settles it.

---

## Two things Daniel should decide, not Dan

- **CE has no advertising at all.** Five students on the books, zero creative ever made.
  The folder is on the shelf waiting for a first campaign.
- **21 students are not in a class**, because the product title never named one. The
  portal will not guess a class from a purchase date, so they sit in a holding folder.

---

## What "done" looks like

If Dan lands the storage and the key, in one pass the school gets: check tracking that
survives a restart, withdrawals that stick, an assistant that can be told things as well
as asked, and a marketing shelf the team can actually reach. Everything else above is
already written and waiting behind those two.
