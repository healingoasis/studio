import { optional_env, required_env, SetupError } from "./env";

const API_VERSION = "2025-07";

type TokenCache = { token: string; expires_at: number };
let cached: TokenCache | null = null;

function store_domain(): string {
  return optional_env("SHOPIFY_STORE", "healing-oasis-us.myshopify.com");
}

/**
 * Exchanges the studio's app credentials for a short-lived Admin API token.
 * The token is held in memory only — never logged, never written to disk.
 */
async function access_token(): Promise<string> {
  if (cached && Date.now() < cached.expires_at) return cached.token;

  const response = await fetch(
    `https://${store_domain()}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: required_env("SHOPIFY_CLIENT_ID"),
        client_secret: required_env("SHOPIFY_SECRET_KEY"),
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new SetupError(
      "The store would not accept the studio's Shopify credentials. They may have been rotated — that is one for Dan."
    );
  }

  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!body.access_token) {
    throw new SetupError("The store did not return an access token.");
  }

  // Refresh a minute early so a long page render never runs off the end of the token.
  const ttl_ms = (body.expires_in ?? 3600) * 1000;
  cached = {
    token: body.access_token,
    expires_at: Date.now() + Math.max(ttl_ms - 60_000, 30_000),
  };
  return cached.token;
}

export async function shopify_graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(
    `https://${store_domain()}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": await access_token(),
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify replied ${response.status}`);
  }

  const body = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  if (!body.data) throw new Error("Shopify returned no data.");
  return body.data;
}

// ---------------------------------------------------------------- orders

export type RawLineItem = {
  title: string;
  quantity: number;
  original_total: number;
};

export type RawOrder = {
  order_id: string;
  order_number: string;
  created_at: string;
  financial_status: string | null;
  customer_id: string;
  customer_name: string;
  customer_email: string | null;
  /** Two-letter state, for the bottom line of a desk name tag. */
  customer_state: string | null;
  net_payment: number;
  total_price: number;
  line_items: RawLineItem[];
};

type OrdersResponse = {
  orders: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: {
      node: {
        id: string;
        name: string;
        createdAt: string;
        displayFinancialStatus: string | null;
        customer: {
          id: string;
          firstName: string | null;
          lastName: string | null;
          email: string | null;
          defaultAddress: { provinceCode: string | null } | null;
        } | null;
        billingAddress: { provinceCode: string | null } | null;
        shippingAddress: { provinceCode: string | null } | null;
        netPaymentSet: { shopMoney: { amount: string } };
        totalPriceSet: { shopMoney: { amount: string } };
        lineItems: {
          edges: {
            node: {
              title: string;
              quantity: number;
              originalTotalSet: { shopMoney: { amount: string } };
            };
          }[];
        };
      };
    }[];
  };
};

const ORDERS_QUERY = `
  query Orders($cursor: String) {
    orders(first: 100, after: $cursor, sortKey: CREATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        id
        name
        createdAt
        displayFinancialStatus
        customer {
          id firstName lastName email
          defaultAddress { provinceCode }
        }
        billingAddress { provinceCode }
        shippingAddress { provinceCode }
        netPaymentSet { shopMoney { amount } }
        totalPriceSet { shopMoney { amount } }
        lineItems(first: 20) { edges { node {
          title
          quantity
          originalTotalSet { shopMoney { amount } }
        } } }
      } }
    }
  }
`;

export async function fetch_recent_orders(max_pages = 4): Promise<RawOrder[]> {
  const orders: RawOrder[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < max_pages; page++) {
    const data: OrdersResponse = await shopify_graphql<OrdersResponse>(
      ORDERS_QUERY,
      { cursor }
    );

    for (const edge of data.orders.edges) {
      const n = edge.node;
      if (!n.customer?.id) continue; // point-of-sale walk-ins with no customer record

      const name = [n.customer.firstName, n.customer.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      orders.push({
        order_id: n.id,
        order_number: n.name,
        created_at: n.createdAt,
        financial_status: n.displayFinancialStatus,
        customer_id: n.customer.id,
        customer_name: name || "Name not on file",
        customer_email: n.customer.email,
        // The customer's own address first; the order's addresses are the fallback,
        // since a clinic may have been billed for someone who lives elsewhere.
        customer_state:
          n.customer.defaultAddress?.provinceCode ||
          n.billingAddress?.provinceCode ||
          n.shippingAddress?.provinceCode ||
          null,
        net_payment: Number(n.netPaymentSet.shopMoney.amount),
        total_price: Number(n.totalPriceSet.shopMoney.amount),
        line_items: n.lineItems.edges.map((l) => ({
          title: l.node.title,
          quantity: l.node.quantity,
          original_total: Number(l.node.originalTotalSet.shopMoney.amount),
        })),
      });
    }

    if (!data.orders.pageInfo.hasNextPage) break;
    cursor = data.orders.pageInfo.endCursor;
    if (!cursor) break;
  }

  return orders;
}
