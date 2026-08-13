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
  price: number;
  compare_at: number | null;
  image: string | null;
  image_alt: string;
  available: boolean;
};

export type Shelves = {
  merchandise: ShopItem[];
  seminars: ShopItem[];
};

type FeedVariant = {
  price: string;
  compare_at_price: string | null;
  available: boolean;
};

type FeedImage = { src: string; alt: string | null };

type FeedProduct = {
  handle: string;
  title: string;
  product_type: string | null;
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

function to_item(product: FeedProduct): ShopItem | null {
  const variant = product.variants[0];
  if (!variant) return null;

  const image = product.images[0];
  const compare = variant.compare_at_price ? Number(variant.compare_at_price) : null;
  const price = Number(variant.price);

  return {
    handle: product.handle,
    title: product.title,
    price,
    compare_at: compare && compare > price ? compare : null,
    image: image ? sized(image.src, 600) : null,
    image_alt: image?.alt || product.title,
    available: variant.available,
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

  merchandise.sort((a, b) => a.price - b.price);
  seminars.sort((a, b) => a.price - b.price);

  const shelves: Shelves = { merchandise, seminars };
  cache = { at: Date.now(), shelves };
  return shelves;
}
