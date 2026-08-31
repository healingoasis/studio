import Link from "next/link";
import { notFound } from "next/navigation";
import { load_program_folder } from "@/lib/office_data";
import { find_class, UNPLACED } from "@/lib/roster";
import { NAME_TAG } from "@/lib/admin_docs";
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

      {cards.some((c) => c.needs_name) ? (
        <p className="tags-warn bad">
          {cards.filter((c) => c.needs_name).length} of these are printing a clinic name
          or half a name, because that is all the store has.{" "}
          <Link href={`/office/${folder.program.key}/class/${klass.slug}`}>
            Fix the names
          </Link>{" "}
          before this goes near a printer.
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
            {/* Drawn in the page's own points, so a baseline is a baseline whatever
                serif the printing machine happens to have. */}
            <svg
              className="tag"
              viewBox={`0 0 ${NAME_TAG.page_width} ${NAME_TAG.page_height}`}
              width={`${NAME_TAG.page_width}pt`}
              height={`${NAME_TAG.page_height}pt`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x={0}
                y={0}
                width={NAME_TAG.page_width}
                height={NAME_TAG.page_height}
                fill="#ffffff"
              />
              <rect
                x={NAME_TAG.logo_backing.x}
                y={NAME_TAG.logo_backing.y}
                width={NAME_TAG.logo_backing.width}
                height={NAME_TAG.logo_backing.height}
                fill="#ffffff"
              />
              <image
                href="/healing-oasis-logo.jpg"
                x={NAME_TAG.logo.x}
                y={NAME_TAG.logo.y}
                width={NAME_TAG.logo.width}
                height={NAME_TAG.logo.height}
              />
              <g
                textAnchor="middle"
                fill="#000000"
                fontFamily={NAME_TAG.font_stack}
              >
                <text
                  x={NAME_TAG.centre_x}
                  y={NAME_TAG.first.baseline}
                  fontSize={NAME_TAG.first.size}
                >
                  {entry.first_name}
                </text>
                <text
                  x={NAME_TAG.centre_x}
                  y={NAME_TAG.last.baseline}
                  fontSize={NAME_TAG.last.size}
                >
                  {entry.last_name}
                  {entry.degree ? `, ${entry.degree}` : ""}
                </text>
                <text
                  x={NAME_TAG.centre_x}
                  y={NAME_TAG.state.baseline}
                  fontSize={NAME_TAG.state.size}
                >
                  {entry.state ?? ""}
                </text>
              </g>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
