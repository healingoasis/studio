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
};

export type Shelves = {
  merchandise: ShopItem[];
  seminars: ShopItem[];
};

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
  options: FeedOption[];
  variants: FeedVariant[];
  images: FeedImage[];
};

/** Programme tuition and internal test products are not things to browse. */
const NOT_FOR_SALE_HERE = new Set(["Programs", "LAB"]);

/** Trade stands and sponsorships are for exhibitors, not students. */
const EXHIBITOR = /exhibitor|sponsor|booth|presenter|ally|dine & learn/i;

/** Ask Shopify's CDN for a sensible size rather than shipping full-resolution photos. */
function sized(src: string, width: number): string {
  try {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    return url.toString();
  } catch {
    return src;
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
  };
}

// Product listings change rarely; holding them briefly keeps page loads quick without
// writing anything to disk.
let cache: { at: number; shelves: Shelves } | null = null;
const CACHE_MS = 5 * 60 * 1000;

const EMPTY: Shelves = { merchandise: [], seminars: [] };

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

  for (const product of products) {
    const type = product.product_type ?? "";
    if (NOT_FOR_SALE_HERE.has(type)) continue;
    if (EXHIBITOR.test(product.title)) continue;

    const item = to_item(product);
    if (!item) continue;

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

  const shelves: Shelves = { merchandise, seminars };
  cache = { at: Date.now(), shelves };
  return shelves;
}
