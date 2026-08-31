import type { RawOrder } from "./shopify";

/**
 * Invented orders, for the shareable review link only.
 *
 * The portal normally reads real people out of Shopify. A hosted page that anyone with
 * the link can open is no place for a student's name, email, or what they still owe, so
 * the review build swaps this in for the store: made-up people, made-up order numbers,
 * made-up email addresses on example.com.
 *
 * These are deliberately *orders*, not finished students, so they go through the same
 * `students_from_orders` pipeline as the real thing — the tuition arithmetic, the card
 * fee coming back out, the standings, the payment history. The page under review is
 * therefore the real page; only the people on it are fictional.
 *
 * Switched on by PORTAL_DEMO=1. Never on by default.
 */

const fee = (amount: number) => ({
  title: "Admin Fee",
  quantity: 1,
  original_total: amount,
});

const line = (title: string, original_total: number) => ({
  title,
  quantity: 1,
  original_total,
});

/** A fee-inclusive price: the whole-dollar base with the card rate added back on. */
const with_fee = (base: number) => Math.round(base * 1.034 * 100) / 100;

let n = 1040;
const order = (
  customer: { id: string; name: string; email: string; state?: string },
  created_at: string,
  lines: { title: string; quantity: number; original_total: number }[],
  paid: number,
  status: string = "PAID"
): RawOrder => {
  const total = Math.round(lines.reduce((s, l) => s + l.original_total, 0) * 100) / 100;
  return {
    order_id: `gid://shopify/Order/demo-${n}`,
    order_number: `#${n++}`,
    created_at,
    financial_status: status,
    customer_id: customer.id,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_state: customer.state ?? "WI",
    net_payment: paid,
    total_price: total,
    line_items: lines,
  };
};

const MARISOL = {
  id: "gid://shopify/Customer/demo-1",
  name: "Marisol Vega",
  email: "marisol.vega@example.com",
};
const GRANT = {
  id: "gid://shopify/Customer/demo-2",
  name: "Grant Ellsworth",
  email: "g.ellsworth@example.com",
};
const PRIYA = {
  id: "gid://shopify/Customer/demo-3",
  name: "Priya Raghunathan",
  email: "praghunathan@example.com",
};
const TOMAS = {
  id: "gid://shopify/Customer/demo-4",
  name: "Tomas Bergqvist",
  email: "tomas.b@example.com",
};
const NADINE = {
  id: "gid://shopify/Customer/demo-5",
  name: "Nadine Okoro",
  email: "n.okoro@example.com",
};
const WENDELL = {
  id: "gid://shopify/Customer/demo-6",
  name: "Wendell Craft",
  email: "wendell.craft@example.com",
};
const IMOGEN = {
  id: "gid://shopify/Customer/demo-7",
  name: "Imogen Sattler",
  email: "isattler@example.com",
};
const RAFAEL = {
  id: "gid://shopify/Customer/demo-8",
  name: "Rafael Duarte",
  email: "rafael.duarte@example.com",
};
const BEATRIX = {
  id: "gid://shopify/Customer/demo-9",
  name: "Beatrix Lund",
  email: "b.lund@example.com",
};
const CALLUM = {
  id: "gid://shopify/Customer/demo-10",
  name: "Callum Hoyt",
  email: "c.hoyt@example.com",
};

export const DEMO_ORDERS: RawOrder[] = [
  // Paid in full, the long way: deposit first, balance months later.
  order(MARISOL, "2026-02-11T15:04:00Z", [line("VSMT Program Deposit - Fall 2026", 1000), fee(34)], 1034),
  order(MARISOL, "2026-07-30T09:22:00Z", [line("VSMT Program Balance - Fall 2026", 7389), fee(251.23)], 7640.23),

  // Part way through, paying it down in pieces.
  order(GRANT, "2026-03-02T18:40:00Z", [line("VSMT Program Deposit - Fall 2026", 1000), fee(34)], 1034),
  order(GRANT, "2026-06-18T11:15:00Z", [line("VSMT Program Installment - Fall 2026", 2500), fee(85)], 2585),

  // Deposit down, nothing since.
  order(PRIYA, "2026-05-21T14:02:00Z", [line("VMRT Program Deposit - Spring 2027", 500), fee(17)], 517),

  // Paid in full in one go, at the store's fee-inclusive price with no separate fee line.
  order(TOMAS, "2026-04-09T16:48:00Z", [line("Veterinary Acupuncture Program - Pay in Full - Fall 2026", with_fee(8100))], with_fee(8100)),

  order(NADINE, "2026-01-27T13:30:00Z", [line("Veterinary Acupuncture Program Deposit - Fall 2026", 1000), fee(34)], 1034),
  order(NADINE, "2026-06-04T10:05:00Z", [line("Veterinary Acupuncture Program Installment - Fall 2026", 3000), fee(102)], 3102),

  // Registered, invoice never cleared — owes everything.
  order(WENDELL, "2026-08-05T08:12:00Z", [line("VMRT Program Deposit - Spring 2027", 500), fee(17)], 0, "PENDING"),

  order(IMOGEN, "2026-02-19T17:26:00Z", [line("VMRT Program Deposit - Fall 2026", 500), fee(17)], 517),
  order(IMOGEN, "2026-07-14T12:44:00Z", [line("VMRT Program Installment - Fall 2026", 2500), fee(85)], 2585),

  order(RAFAEL, "2026-07-22T19:03:00Z", [line("Veterinary Acupuncture Program Deposit - Spring 2027", 1000), fee(34)], 1034),

  // A seminar rather than a program: small, and settled.
  order(BEATRIX, "2026-06-28T15:55:00Z", [line("Cranio/Sacral Adjusting Techniques with Applied Kinesiology 2026", with_fee(660))], with_fee(660)),

  // Signed up, then refunded — still on the list, owing everything.
  order(CALLUM, "2026-03-15T09:41:00Z", [line("VSMT Program Deposit - Fall 2026", 1000), fee(34)], 1034, "REFUNDED"),
];
