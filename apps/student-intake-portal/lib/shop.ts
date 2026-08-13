/**
 * The shop shelves, read from the store's own public product feed.
 *
 * Deliberately the public feed rather than the Admin API: it shows exactly what a
 * customer would see — published products only, current prices — and needs no
 * credentials. Nothing here is personal data.
 */

const STORE = "https://healing-oasis-us.myshopify.com";

export const product_url = (handle: string) => `${STORE}/products/${handle}`;

export type ShopItem = {
  handle: string;
  title: string;
  /**
   * Products here have real variants at different prices — a bale cover is $224.38 while
   * the full bale is $387.75, and the photo shows the full bale. Showing only the
   * cheapest variant's price against that photo misleads, so both ends are carried.
   */
  price_min: number;
  price_max: number;
  compare_at: number | null;
  /** Plain-language summary of the choices, e.g. "Cover or Full Bale". */
  choices: string | null;
  image: string | null;
  image_alt: string;
  available: boolean;
  /** Listed prices already include the card fee, so they can be broken down. */
  fee_included: boolean;
};

/**
 * A programme, not one of its classes. The store sells a separate product per cohort
 * ("VSMT 2027 Spring Class — Pay in Full"), which is the right way to take money but the
 * wrong way to browse: someone deciding whether to do VSMT does not want to read four
 * near-identical cards. The classes become a choice once they are on the programme page.
 */
export type ProgramCohort = {
  /** The pay-in-full product for this class. */
  handle: string;
  /** The matching deposit product, where the store has one. */
  deposit_handle: string | null;
};

export type ProgramGroup = {
  key: string;
  short_name: string;
  full_name: string;
  /** Earliest class first. */
  cohorts: ProgramCohort[];
};

export type Shelves = {
  merchandise: ShopItem[];
  seminars: ShopItem[];
  programs: ProgramGroup[];
};

/** Where a student lands to read about something before deciding. */
export const detail_url = (handle: string) => `/shop/${handle}`;

export const program_url = (key: string) => `/program/${key}`;

/**
 * Shopify's cart permalink. Following it puts the chosen variant in the basket and goes
 * straight to the store's checkout — the buying happens on Shopify, never here.
 */
export const checkout_url = (variant_id: number, quantity = 1) =>
  `${STORE}/cart/${variant_id}:${quantity}`;

// ---------------------------------------------------------------- the card fee

/**
 * The store's listed prices already include the card processing fee, marked by a
 * `cc-fee-included` tag. Every price on the store divides back to a whole dollar at this
 * rate — a $200 deposit lists at $206.80, an $8,189 balance at $8,467 — so a student
 * sees only the higher number and cannot tell what the school actually charges.
 * Splitting it out is the honest presentation, and matches how the website reads.
 */
export const CARD_FEE_RATE = 0.034;

const CC_FEE_TAG = /cc[-\s]?fee[-\s]?included/i;

export const includes_card_fee = (tags: string[] | undefined): boolean =>
  (tags ?? []).some((t) => CC_FEE_TAG.test(t));

export type Breakdown = { base: number; fee: number; total: number };

/**
 * Splits a listed price back into what the school charges and the card fee on top.
 * Returns null when there is nothing to split, so callers can just show the price.
 */
export function breakdown(total: number, fee_included: boolean): Breakdown | null {
  if (!fee_included || total <= 0) return null;

  // Every base price on the store is a whole number of dollars, so rounding recovers it
  // exactly rather than leaving a penny adrift.
  const base = Math.round(total / (1 + CARD_FEE_RATE));
  const fee = Math.round((total - base) * 100) / 100;

  if (fee <= 0) return null;
  return { base, fee, total };
}

type FeedVariant = {
  title: string;
  price: string;
  compare_at_price: string | null;
  available: boolean;
};

type FeedImage = { src: string; alt: string | null };

type FeedOption = { name: string; values: string[] };

type FeedProduct = {
  handle: string;
  title: string;
  product_type: string | null;
  tags: string[] | string | null;
  options: FeedOption[];
  variants: FeedVariant[];
  images: FeedImage[];
};

/** Internal test products are never shown. */
const INTERNAL = /\btest\b|do not buy/i;

/** Trade stands and sponsorships are for exhibitors, not students. */
const EXHIBITOR = /exhibitor|sponsor|booth|presenter|ally|dine & learn/i;

/**
 * Of the programme products, only the full-tuition ones belong on a browse shelf.
 * Deposits and outstanding balances are steps in an enrolment someone already has.
 */
const PROGRAM_TO_BROWSE = /pay in full|full tuition/i;

/**
 * Names live here rather than being imported from lib/students.ts, which reaches for
 * node:fs through the Shopify client and so cannot be pulled into the browser bundle.
 */
const PROGRAM_NAMES: { key: string; short_name: string; full_name: string; match: RegExp }[] = [
  { key: "vsmt", short_name: "VSMT", full_name: "Veterinary Spinal Manipulative Therapy", match: /\bvsmt\b|spinal manipulat/i },
  { key: "vmrt", short_name: "VMRT", full_name: "Veterinary Massage & Rehabilitation Therapy", match: /\bvmrt\b|massage|rehabilitation/i },
  { key: "acupuncture", short_name: "Acupuncture", full_name: "Veterinary Acupuncture", match: /acupuncture/i },
];

const SEASON_ORDER: Record<string, number> = { spring: 1, summer: 2, fall: 3, winter: 4 };

/** "VSMT 2027 Spring Class — Pay in Full" → sortable, and "Spring 2027" to show. */
export function class_term_of(title: string): { label: string; sort: number } {
  const a = /(20\d\d)\s*(spring|summer|fall|winter)/i.exec(title);
  const b = /(spring|summer|fall|winter)\s*(20\d\d)/i.exec(title);

  const year = a?.[1] ?? b?.[2];
  const season = (a?.[2] ?? b?.[1])?.toLowerCase();

  if (!year || !season) return { label: "Next available class", sort: 0 };

  const pretty = season.charAt(0).toUpperCase() + season.slice(1);
  return {
    label: `${pretty} ${year}`,
    sort: Number(year) * 10 + (SEASON_ORDER[season] ?? 0),
  };
}

type ProgramProduct = { handle: string; title: string };

/**
 * Finds the deposit that belongs to a class. The store names most of them predictably
 * (`vsmt-2026-fall-full` → `vsmt-2026-fall-deposit`), but not all — Acupuncture's is
 * just `acupuncture-program` — so fall back to matching on programme and term.
 */
function deposit_for(
  cohort: ProgramProduct,
  deposits: ProgramProduct[],
  match: RegExp
): string | null {
  const by_name = cohort.handle.replace(/-(full|pay-in-full)$/, "-deposit");
  if (deposits.some((d) => d.handle === by_name)) return by_name;

  const for_program = deposits.filter((d) => match.test(d.title));
  if (for_program.length === 0) return null;

  const term = class_term_of(cohort.title).sort;
  const same_term = for_program.find((d) => class_term_of(d.title).sort === term);
  if (same_term) return same_term.handle;

  // A programme-wide deposit with no class in its name covers every class.
  const generic = for_program.find((d) => class_term_of(d.title).sort === 0);
  return generic?.handle ?? null;
}

function group_programs(
  full_price: ProgramProduct[],
  deposits: ProgramProduct[]
): ProgramGroup[] {
  const groups: ProgramGroup[] = [];

  for (const meta of PROGRAM_NAMES) {
    const classes = full_price
      .filter((i) => meta.match.test(i.title))
      .sort((a, b) => class_term_of(a.title).sort - class_term_of(b.title).sort);

    if (classes.length === 0) continue;

    groups.push({
      key: meta.key,
      short_name: meta.short_name,
      full_name: meta.full_name,
      cohorts: classes.map((c) => ({
        handle: c.handle,
        deposit_handle: deposit_for(c, deposits, meta.match),
      })),
    });
  }

  return groups;
}

export function program_group(key: string, groups: ProgramGroup[]): ProgramGroup | null {
  return groups.find((g) => g.key === key) ?? null;
}

/** Ask Shopify's CDN for a sensible size rather than shipping full-resolution photos. */
function sized(src: string, width: number): string {
  // The .js endpoint returns protocol-relative URLs, which would resolve to http:// on
  // a local page and fail. The product feed returns absolute ones.
  const absolute = src.startsWith("//") ? `https:${src}` : src;
  try {
    const url = new URL(absolute);
    url.searchParams.set("width", String(width));
    return url.toString();
  } catch {
    return absolute;
  }
}

/** Shopify gives every product an option even when there is nothing to choose. */
const NO_REAL_CHOICE = /^(title|default)$/i;

function list_words(values: string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  const last = values[values.length - 1];
  return `${values.slice(0, -1).join(", ")} or ${last}`;
}

function plural(name: string): string {
  const lower = name.toLowerCase();
  return lower.endsWith("s") ? lower : `${lower}s`;
}

/** "Cover or Full Bale", "4 sizes", "Beef & Pumpkin, Alaskan Cod or … · 8oz or 16oz". */
function describe_choices(options: FeedOption[]): string | null {
  const parts: string[] = [];

  for (const option of options) {
    if (NO_REAL_CHOICE.test(option.name)) continue;
    const values = option.values.filter(Boolean);
    if (values.length < 2) continue; // a single colour is not a choice
    parts.push(values.length > 3 ? `${values.length} ${plural(option.name)}` : list_words(values));
  }

  return parts.length ? parts.join(" · ") : null;
}

function to_item(product: FeedProduct): ShopItem | null {
  const variants = product.variants ?? [];
  if (variants.length === 0) return null;

  const prices = variants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n));
  if (prices.length === 0) return null;

  const price_min = Math.min(...prices);
  const price_max = Math.max(...prices);

  // Only worth showing a "was" price against the cheapest variant, which is the one the
  // headline price refers to.
  const cheapest = variants.find((v) => Number(v.price) === price_min);
  const compare = cheapest?.compare_at_price ? Number(cheapest.compare_at_price) : null;

  const image = product.images[0];

  return {
    handle: product.handle,
    title: product.title,
    price_min,
    price_max,
    compare_at: compare && compare > price_min ? compare : null,
    choices: describe_choices(product.options ?? []),
    image: image ? sized(image.src, 600) : null,
    image_alt: image?.alt || product.title,
    available: variants.some((v) => v.available),
    // The feed returns tags as an array, but a comma-separated string on some stores.
    fee_included: includes_card_fee(
      Array.isArray(product.tags)
        ? product.tags
        : (product.tags ?? "").split(",").map((t) => t.trim())
    ),
  };
}

// Product listings change rarely; holding them briefly keeps page loads quick without
// writing anything to disk.
let cache: { at: number; shelves: Shelves } | null = null;
const CACHE_MS = 5 * 60 * 1000;

const EMPTY: Shelves = { merchandise: [], seminars: [], programs: [] };

export async function load_shelves(): Promise<Shelves> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.shelves;

  let products: FeedProduct[];
  try {
    const response = await fetch(`${STORE}/products.json?limit=250`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`store replied ${response.status}`);
    const body = (await response.json()) as { products?: FeedProduct[] };
    products = body.products ?? [];
  } catch (error) {
    // The shop shelf is a nice-to-have; it must never take the whole page down.
    console.error("[student-intake] could not load the shop shelves:", error);
    return cache?.shelves ?? EMPTY;
  }

  const merchandise: ShopItem[] = [];
  const seminars: ShopItem[] = [];
  const full_price: ProgramProduct[] = [];
  const deposits: ProgramProduct[] = [];

  for (const product of products) {
    const type = product.product_type ?? "";
    if (type === "LAB" || INTERNAL.test(product.title)) continue;
    if (EXHIBITOR.test(product.title)) continue;

    const item = to_item(product);
    if (!item) continue;

    if (type === "Programs") {
      const entry = { handle: product.handle, title: product.title };
      if (PROGRAM_TO_BROWSE.test(product.title)) full_price.push(entry);
      else if (/deposit/i.test(product.title)) deposits.push(entry);
      continue;
    }

    if (type === "Event Tickets") {
      seminars.push(item);
      continue;
    }

    // Merchandise is the part of the store with photographs. Anything untyped and
    // pictureless is an admin or registration product, not something to browse.
    if (item.image) merchandise.push(item);
  }

  merchandise.sort((a, b) => a.price_min - b.price_min);
  seminars.sort((a, b) => a.price_min - b.price_min);

  const shelves: Shelves = {
    merchandise,
    seminars,
    programs: group_programs(full_price, deposits),
  };
  cache = { at: Date.now(), shelves };
  return shelves;
}

// ---------------------------------------------------------------- one product

export type ProductVariant = {
  id: number;
  title: string;
  /** One entry per option, in the same order as `options`. */
  options: string[];
  price: number;
  compare_at: number | null;
  available: boolean;
};

export type ProductDetail = {
  handle: string;
  title: string;
  description_html: string;
  images: string[];
  options: { name: string; values: string[] }[];
  variants: ProductVariant[];
  price_min: number;
  price_max: number;
  available: boolean;
  fee_included: boolean;
};

/**
 * Descriptions are written by the school in Shopify's editor, so they arrive as HTML.
 * Rather than trust it, everything is thrown away except a short list of formatting
 * tags, and every attribute is dropped apart from an http(s) link target.
 */
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "h2", "h3", "h4", "span", "div", "a", "blockquote",
]);

function sanitize(html: string): string {
  const without_blocks = html.replace(
    /<(script|style|iframe|object|embed|form)[\s\S]*?<\/\1\s*>/gi,
    ""
  );

  return without_blocks.replace(
    /<\/?([a-zA-Z0-9-]+)([^>]*)>/g,
    (match, raw_tag: string, attrs: string) => {
      const tag = raw_tag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (match.startsWith("</")) return `</${tag}>`;

      if (tag === "a") {
        const href = /href\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1] ?? "";
        if (!/^https?:\/\//i.test(href)) return "<a>";
        return `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer">`;
      }

      return `<${tag}>`;
    }
  );
}

type DetailVariant = {
  id: number;
  title: string;
  options: string[];
  price: number;
  compare_at_price: number | null;
  available: boolean;
};

type DetailResponse = {
  handle: string;
  title: string;
  tags: string[] | null;
  description: string | null;
  images: string[];
  options: { name: string; values: string[] }[];
  variants: DetailVariant[];
};

/** Prices from this endpoint arrive in cents, unlike the product feed. */
const from_cents = (n: number) => n / 100;

export async function load_product(handle: string): Promise<ProductDetail | null> {
  if (!/^[a-z0-9][a-z0-9-]{0,120}$/i.test(handle)) return null;

  let body: DetailResponse;
  try {
    const response = await fetch(`${STORE}/products/${handle}.js`, { cache: "no-store" });
    if (!response.ok) return null;
    body = (await response.json()) as DetailResponse;
  } catch (error) {
    console.error(`[student-intake] could not load product ${handle}:`, error);
    return null;
  }

  if (!body?.variants?.length) return null;
  if (INTERNAL.test(body.title)) return null;

  const variants: ProductVariant[] = body.variants.map((v) => ({
    id: v.id,
    title: v.title,
    options: v.options ?? [],
    price: from_cents(v.price),
    compare_at:
      v.compare_at_price && v.compare_at_price > v.price
        ? from_cents(v.compare_at_price)
        : null,
    available: v.available,
  }));

  const prices = variants.map((v) => v.price);

  return {
    handle: body.handle,
    title: body.title,
    description_html: sanitize(body.description ?? ""),
    images: (body.images ?? []).map((src) => sized(src, 900)),
    options: (body.options ?? []).filter((o) => !NO_REAL_CHOICE.test(o.name)),
    variants,
    price_min: Math.min(...prices),
    price_max: Math.max(...prices),
    available: variants.some((v) => v.available),
    fee_included: includes_card_fee(body.tags ?? undefined),
  };
}
