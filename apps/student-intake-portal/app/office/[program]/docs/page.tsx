import Link from "next/link";
import { notFound } from "next/navigation";
import { load_program_folder } from "@/lib/office_data";
import { ADMIN_DOCS } from "@/lib/admin_docs";
import { load_templates } from "@/lib/templates";
import DocsView from "./docs-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;
  const folder = await load_program_folder(program);
  return {
    title: folder
      ? `${folder.program.short_name} admin documents — Healing Oasis`
      : "Not found",
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;
  const folder = await load_program_folder(program);
  if (!folder) notFound();

  const templates = await load_templates();

  return (
    <main className="wrap">
      <div className="crumb">
        <Link href={`/office/${folder.program.key}`}>
          ← {folder.program.short_name} folders
        </Link>
      </div>

      <div className="masthead">
        <div>
          <p className="eyebrow">Office · {folder.program.short_name}</p>
          <h1>Admin Documents</h1>
        </div>
      </div>

      <DocsView
        program_key={folder.program.key}
        docs={ADMIN_DOCS}
        classes={folder.classes.map((c) => ({
          slug: c.slug,
          label: c.label,
          count: c.active.length,
        }))}
        templates={templates}
      />

      <footer>
        Built from the school&rsquo;s own documents · every list is generated from the
        class as it stands right now
      </footer>
    </main>
  );
}
