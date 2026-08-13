import Link from "next/link";
import { notFound } from "next/navigation";
import {
  class_term_of,
  load_product,
  load_shelves,
  program_group,
  type ProductDetail,
} from "@/lib/shop";
import ProgramView from "./program-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const group = program_group(key, (await load_shelves()).programs);
  return { title: group ? `${group.short_name} — Healing Oasis` : "Not found" };
}

export type Cohort = {
  label: string;
  product: ProductDetail;
  /** The deposit that holds a place on this class, where the store sells one. */
  deposit: ProductDetail | null;
};

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const group = program_group(key, (await load_shelves()).programs);
  if (!group) notFound();

  const loaded = await Promise.all(
    group.cohorts.map(async (c) => {
      const [product, deposit] = await Promise.all([
        load_product(c.handle),
        c.deposit_handle ? load_product(c.deposit_handle) : Promise.resolve(null),
      ]);
      return { product, deposit };
    })
  );

  const cohorts: Cohort[] = loaded
    .filter((c): c is { product: ProductDetail; deposit: ProductDetail | null } =>
      c.product !== null
    )
    .map(({ product, deposit }) => ({
      label: class_term_of(product.title).label,
      product,
      deposit,
    }));

  if (cohorts.length === 0) notFound();

  return (
    <main className="wrap">
      <div className="crumb">
        <Link href="/">← Back to the portal</Link>
      </div>
      <ProgramView
        short_name={group.short_name}
        full_name={group.full_name}
        cohorts={cohorts}
      />
    </main>
  );
}
