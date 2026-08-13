import Link from "next/link";
import { notFound } from "next/navigation";
import { load_product } from "@/lib/shop";
import ProductView from "./product-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await load_product(handle);
  return { title: product ? `${product.title} — Healing Oasis` : "Not found" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await load_product(handle);

  if (!product) notFound();

  return (
    <main className="wrap">
      <div className="crumb">
        <Link href="/">← Back to the portal</Link>
      </div>
      <ProductView product={product} />
    </main>
  );
}
