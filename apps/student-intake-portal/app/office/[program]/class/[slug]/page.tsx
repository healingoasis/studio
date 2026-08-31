import Link from "next/link";
import { notFound } from "next/navigation";
import { load_program_folder } from "@/lib/office_data";
import { class_label, find_class, movable_classes, UNPLACED } from "@/lib/roster";
import ClassView from "./class-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ program: string; slug: string }>;
}) {
  const { program, slug } = await params;
  const folder = await load_program_folder(program);
  if (!folder) return { title: "Not found" };
  const label = slug === UNPLACED ? "Not yet in a class" : class_label(slug);
  return { title: `${folder.program.short_name} ${label} — Healing Oasis` };
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ program: string; slug: string }>;
}) {
  const { program, slug } = await params;
  const folder = await load_program_folder(program);
  if (!folder) notFound();

  const klass = find_class(folder, slug);
  if (!klass) notFound();

  return (
    <main className="wrap">
      <div className="crumb">
        <Link href={`/office/${folder.program.key}`}>
          ← {folder.program.short_name} folders
        </Link>
      </div>

      <ClassView
        program_key={folder.program.key}
        program_name={folder.program.short_name}
        klass={{
          slug: klass.slug,
          label: klass.slug === UNPLACED ? "Not yet in a class" : klass.label,
          entries: klass.entries.map((e) => ({
            student_id: e.student.student_id,
            name: e.name,
            store_name: e.student.name,
            first_name: e.first_name,
            last_name: e.last_name,
            email: e.student.email,
            degree: e.degree,
            state: e.state,
            store_state: e.student.state,
            class_slug: e.class_slug,
            auto_placed: e.auto_placed,
            dropped: e.dropped,
            remaining: e.student.remaining,
          })),
        }}
        classes={movable_classes(folder)}
      />

      <footer>
        Read live from the store · every correction here is saved on this Mac only ·
        nothing is ever written back to the store
      </footer>
    </main>
  );
}
