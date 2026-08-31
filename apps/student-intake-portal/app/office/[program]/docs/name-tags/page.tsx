import Link from "next/link";
import { notFound } from "next/navigation";
import { load_program_folder } from "@/lib/office_data";
import { find_class, UNPLACED } from "@/lib/roster";
import { line_top_pt, NAME_TAG } from "@/lib/admin_docs";
import PrintButton from "./print-button";

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
      ? `${folder.program.short_name} name tags — Healing Oasis`
      : "Not found",
  };
}

const pt = (n: number) => `${n}pt`;

export default async function NameTagsPage({
  params,
  searchParams,
}: {
  params: Promise<{ program: string }>;
  searchParams: Promise<{ class?: string }>;
}) {
  const { program } = await params;
  const { class: slug } = await searchParams;
  const folder = await load_program_folder(program);
  if (!folder) notFound();

  const klass = slug ? find_class(folder, slug) : folder.classes[0] ?? null;
  if (!klass || klass.slug === UNPLACED) notFound();

  // Only the people who will actually be in the room get a card on the table.
  const cards = klass.active;

  return (
    <>
      <div className="tags-bar">
        <Link href={`/office/${folder.program.key}/docs`}>
          ← Admin Documents
        </Link>
        <div className="tags-bar-mid">
          <strong>
            {folder.program.short_name} · {klass.label} Class
          </strong>
          <span>
            {cards.length} {cards.length === 1 ? "name tag" : "name tags"}, one per page
          </span>
        </div>
        <PrintButton count={cards.length} />
      </div>

      {cards.length === 0 ? (
        <p className="tags-empty">
          Nobody in this class is marked as coming, so there is nothing to print.
        </p>
      ) : null}

      {cards.some((c) => !c.degree) ? (
        <p className="tags-warn">
          {cards.filter((c) => !c.degree).length} of these have no degree yet, so their
          card will read just the surname.{" "}
          <Link href={`/office/${folder.program.key}/class/${klass.slug}`}>
            Add the missing ones
          </Link>{" "}
          and come back.
        </p>
      ) : null}

      <div className="tags">
        {cards.map((entry) => (
          <div className="tag-frame" key={entry.student.student_id}>
          <div className="tag">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tag-logo"
              src="/healing-oasis-logo.jpg"
              alt="The Healing Oasis Wellness Center"
              style={{
                left: pt(NAME_TAG.logo.left_pt),
                top: pt(NAME_TAG.logo.top_pt),
                width: pt(NAME_TAG.logo.width_pt),
                height: pt(NAME_TAG.logo.height_pt),
              }}
            />
            <div
              className="tag-line tag-first"
              style={{
                top: pt(line_top_pt(NAME_TAG.first)),
                fontSize: pt(NAME_TAG.first.size_pt),
              }}
            >
              {entry.first_name}
            </div>
            <div
              className="tag-line tag-last"
              style={{
                top: pt(line_top_pt(NAME_TAG.last)),
                fontSize: pt(NAME_TAG.last.size_pt),
              }}
            >
              {entry.last_name}
              {entry.degree ? `, ${entry.degree}` : ""}
            </div>
            <div
              className="tag-line tag-state"
              style={{
                top: pt(line_top_pt(NAME_TAG.state)),
                fontSize: pt(NAME_TAG.state.size_pt),
              }}
            >
              {entry.state ?? ""}
            </div>
          </div>
          </div>
        ))}
      </div>
    </>
  );
}
