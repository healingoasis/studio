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
};

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const group = program_group(key, (await load_shelves()).programs);
  if (!group) notFound();

  const loaded = await Promise.all(group.handles.map((h) => load_product(h)));

  const cohorts: Cohort[] = loaded
    .filter((p): p is ProductDetail => p !== null)
    .map((product) => ({
      label: class_term_of(product.title).label,
      product,
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
