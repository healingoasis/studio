import { CARD_FEE_RATE } from "./shop";
import { fetch_recent_orders, type RawOrder } from "./shopify";

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * What the school actually charges, with the card processing taken back out.
 *
 * The store does this two different ways, so both are handled:
 *  - most orders carry an explicit "Admin Fee" line beside a base-priced product, so the
 *    fee is simply subtracted;
 *  - deposits and balances are sold at a fee-inclusive price with no separate line, so
 *    the rate is divided back out — but only when that lands on a whole dollar, which is
 *    what tells us the fee was actually in there. Someone who paid by cheque already
 *    paid the base, and dividing again would understate what they have paid.
 */
function without_card_fee(net_paid: number, fee_lines: number): number {
  if (net_paid <= 0) return 0;
  if (fee_lines > 0) return round2(net_paid - fee_lines);

  const base = net_paid / (1 + CARD_FEE_RATE);
  const whole = Math.round(base);
  return Math.abs(base - whole) < 0.02 ? whole : round2(net_paid);
}

// ---------------------------------------------------------------- programs

export type ProgramKey = "vsmt" | "vmrt" | "acupuncture" | "cranio";

export type Program = {
  key: ProgramKey;
  short_name: string;
  full_name: string;
  tuition: number;
  balance_handle: string;
};

/** Prices are the store's own "pay in full" products, which already include the card fee. */
export const PROGRAMS: Record<ProgramKey, Program> = {
  vsmt: {
    key: "vsmt",
    short_name: "VSMT",
    full_name: "Veterinary Spinal Manipulative Therapy",
    tuition: 8674.0,
    balance_handle: "vsmt-program-balance",
  },
  vmrt: {
    key: "vmrt",
    short_name: "VMRT",
    full_name: "Veterinary Massage & Rehabilitation Therapy",
    tuition: 6399.0,
    balance_handle: "vmrt-program-balance",
  },
  acupuncture: {
    key: "acupuncture",
    short_name: "Acupuncture",
    full_name: "Veterinary Acupuncture",
    tuition: 8375.0,
    balance_handle: "acupuncture-program-balance",
  },
  cranio: {
    key: "cranio",
    short_name: "Cranio/Sacral",
    full_name: "Cranio/Sacral Adjusting Techniques with Applied Kinesiology",
    tuition: 682.0,
    balance_handle: "cranio-sacral-2026",
  },
};

/**
 * Both sides of the sum are now the school's own figures with no card fee in them, so
 * this only has to absorb rounding and the odd few dollars, not a whole processing fee.
 */
const SETTLED_TOLERANCE = 5;

function program_of(title: string): ProgramKey | null {
  const t = title.toLowerCase();
  // Cranio first: its full title mentions applied kinesiology, not the other programmes.
  if (/cranio|applied kinesiolog/.test(t)) return "cranio";
  if (/\bvsmt\b|spinal manipulat/.test(t)) return "vsmt";
  if (/\bvmrt\b|massage|rehabilitation/.test(t)) return "vmrt";
  if (/acupuncture/.test(t)) return "acupuncture";
  return null;
}

const FEE_LINE = /admin(istrative)? fee|cc processing|processing fee/i;

function is_fee_line(title: string): boolean {
  return FEE_LINE.test(title);
}

/**
 * The store keeps a live test product — "LAB — VSMT Fall 2026 (TEST — do not buy)".
 * Anything bought against it is not a student, and must never reach a printed class list.
 */
const TEST_LINE = /\btest\b|do not buy|^\s*lab\s*[—-]/i;

function is_test_line(title: string): boolean {
  return TEST_LINE.test(title);
}

export type PaymentKind =
  | "Deposit"
  | "Balance"
  | "Installment"
  | "Paid in full"
  | "Payment";

function payment_kind(titles: string[]): PaymentKind {
  const t = titles.join(" ").toLowerCase();
  if (/deposit/.test(t)) return "Deposit";
  if (/installment/.test(t)) return "Installment";
  if (/pay in full|full tuition|pay-in-full/.test(t)) return "Paid in full";
  if (/balance|remaining/.test(t)) return "Balance";
  return "Payment";
}

function class_term(titles: string[]): string | null {
  for (const title of titles) {
    const a = title.match(/(fall|spring|summer|winter)\s*(20\d\d)/i);
    if (a?.[1] && a[2]) return `${cap(a[1])} ${a[2]}`;
    const b = title.match(/(20\d\d)\s*(fall|spring|summer|winter)/i);
    if (b?.[1] && b[2]) return `${cap(b[2])} ${b[1]}`;
  }
  return null;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// ---------------------------------------------------------------- students

export type Payment = {
  order_number: string;
  paid_on: string;
  kind: PaymentKind;
  label: string;
  /** What the card was actually charged, so it reconciles with a bank statement. */
  amount: number;
  /** The same payment with the card processing taken out. */
  base_amount: number;
  refunded: boolean;
  /** Placed but nothing has cleared — an unpaid invoice, not money in the bank. */
  pending: boolean;
};

export type PaymentStanding =
  | "nothing_paid"
  | "deposit_only"
  | "partly_paid"
  | "paid_in_full";

export type Student = {
  student_id: string;
  name: string;
  email: string | null;
  /** Two-letter state from the store, for the bottom line of a desk name tag. */
  state: string | null;
  program: Program;
  class_term: string | null;
  tuition: number;
  /** The 3.4% the card processor takes, shown beside tuition rather than hidden in it. */
  card_fee: number;
  /** What a card is actually charged: tuition plus the fee. The store's own price. */
  total_with_card: number;
  paid: number;
  remaining: number;
  standing: PaymentStanding;
  payments: Payment[];
  last_paid_on: string | null;
};

/**
 * Turns raw orders into one row per person on a program. Anyone who only ever bought
 * merchandise, a seminar, or a conference ticket is left out — this is the intake list,
 * not the customer list.
 */
export function students_from_orders(orders: RawOrder[]): Student[] {
  const by_customer = new Map<string, RawOrder[]>();

  for (const order of orders) {
    const touches_program = order.line_items.some(
      (li) =>
        !is_fee_line(li.title) &&
        !is_test_line(li.title) &&
        program_of(li.title) !== null
    );
    if (!touches_program) continue;
    const list = by_customer.get(order.customer_id);
    if (list) list.push(order);
    else by_customer.set(order.customer_id, [order]);
  }

  const students: Student[] = [];

  for (const [customer_id, customer_orders] of by_customer) {
    // Most recent first from the API; walk oldest first so payments read as a story.
    const sorted = [...customer_orders].sort(
      (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)
    );

    const tally: Record<ProgramKey, number> = {
      vsmt: 0,
      vmrt: 0,
      acupuncture: 0,
      cranio: 0,
    };
    for (const order of sorted) {
      for (const li of order.line_items) {
        if (is_fee_line(li.title) || is_test_line(li.title)) continue;
        const key = program_of(li.title);
        if (key) tally[key] += 1;
      }
    }

    const program_key = (Object.keys(tally) as ProgramKey[]).reduce((best, key) =>
      tally[key] > tally[best] ? key : best
    );
    const program = PROGRAMS[program_key];

    // The store lists tuition with the card fee already in it. The profile shows what
    // the school charges — VSMT reads $8,389, not $8,674 — with the fee broken out
    // beside it, so the higher number at checkout is never a surprise.
    const tuition = Math.round(program.tuition / (1 + CARD_FEE_RATE));
    const card_fee = Math.round((program.tuition - tuition) * 100) / 100;
    const total_with_card = program.tuition;

    const payments: Payment[] = [];
    let paid = 0;

    for (const order of sorted) {
      const status = (order.financial_status || "").toUpperCase();
      const refunded = status === "REFUNDED" || status === "VOIDED";
      const titles = order.line_items
        .filter((li) => !is_fee_line(li.title) && !is_test_line(li.title))
        .map((li) => li.title);

      const fee_lines = order.line_items
        .filter((li) => is_fee_line(li.title))
        .reduce((sum, li) => sum + li.original_total, 0);

      const amount = refunded ? 0 : order.net_payment;
      const pending = !refunded && amount <= 0 && order.total_price > 0;
      const base = without_card_fee(amount, fee_lines);
      paid += base;

      payments.push({
        order_number: order.order_number,
        paid_on: order.created_at.slice(0, 10),
        kind: payment_kind(titles),
        label: titles[0] ?? order.line_items[0]?.title ?? "Order",
        amount: refunded || pending ? order.total_price : amount,
        base_amount:
          refunded || pending
            ? without_card_fee(order.total_price, fee_lines)
            : base,
        refunded,
        pending,
      });
    }

    const raw_remaining = tuition - paid;
    const remaining = raw_remaining <= SETTLED_TOLERANCE ? 0 : raw_remaining;

    let standing: PaymentStanding;
    if (remaining === 0) standing = "paid_in_full";
    else if (paid <= 0) standing = "nothing_paid";
    else if (paid <= tuition * 0.2) standing = "deposit_only";
    else standing = "partly_paid";

    // An order that is still pending has cleared nothing, so it must not count as the
    // last payment — otherwise someone who owes everything looks like they just paid.
    const cleared = payments.filter((p) => !p.refunded && !p.pending && p.amount > 0);
    const last = cleared[cleared.length - 1];

    students.push({
      student_id: customer_id,
      name: sorted[sorted.length - 1]?.customer_name ?? "Name not on file",
      email: sorted[sorted.length - 1]?.customer_email ?? null,
      // Walk back from the newest order: an older one may predate an address.
      state:
        [...sorted].reverse().map((o) => o.customer_state).find(Boolean) ?? null,
      program,
      class_term: class_term(
        sorted.flatMap((o) =>
          o.line_items.map((li) => li.title).filter((t) => !is_test_line(t))
        )
      ),
      tuition,
      card_fee,
      total_with_card,
      paid,
      remaining,
      standing,
      payments,
      last_paid_on: last?.paid_on ?? null,
    });
  }

  // Most recently active first, so whoever just paid is at the top.
  students.sort((a, b) => (b.last_paid_on ?? "").localeCompare(a.last_paid_on ?? ""));
  return students;
}

export async function load_students(): Promise<Student[]> {
  // The review build runs on invented orders so no real student reaches a hosted page.
  if (process.env.PORTAL_DEMO === "1") {
    const { DEMO_ORDERS } = await import("./demo_students");
    return students_from_orders(DEMO_ORDERS);
  }
  return students_from_orders(await fetch_recent_orders());
}
