import Link from "next/link";
import { notFound } from "next/navigation";
import { load_program_folder } from "@/lib/office_data";
import { ADMIN_DOCS } from "@/lib/admin_docs";
import { UNPLACED } from "@/lib/roster";

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
      ? `${folder.program.short_name} — Healing Oasis`
      : "Not found",
  };
}

function FolderIcon() {
  return (
    <svg className="folder-icon" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path
        d="M1 4.5A2.5 2.5 0 0 1 3.5 2h5.2c.7 0 1.35.32 1.78.87l1.1 1.4c.2.25.5.4.83.4H20.5A2.5 2.5 0 0 1 23 7.17V15.5a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 1 15.5z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M1 4.5A2.5 2.5 0 0 1 3.5 2h5.2c.7 0 1.35.32 1.78.87l1.1 1.4c.2.25.5.4.83.4H20.5A2.5 2.5 0 0 1 23 7.17V15.5a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 1 15.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ProgramFolderPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;
  const folder = await load_program_folder(program);
  if (!folder) notFound();

  const ready_docs = ADMIN_DOCS.filter((d) => d.ready).length;

  return (
    <main className="wrap">
      <div className="crumb">
        <Link href="/">← Back to the portal</Link>
      </div>

      <div className="masthead">
        <div>
          <p className="eyebrow">Office · {folder.program.short_name}</p>
          <h1>{folder.program.full_name}</h1>
        </div>
      </div>

      <div className="folders">
        {folder.classes.map((c) => (
          <Link
            key={c.slug}
            className="folder"
            href={`/office/${folder.program.key}/class/${c.slug}`}
          >
            <FolderIcon />
            <span className="folder-name">{c.label} Class</span>
            <span className="folder-sub">
              {c.active.length} {c.active.length === 1 ? "student" : "students"}
              {c.entries.length > c.active.length
                ? ` · ${c.entries.length - c.active.length} withdrawn`
                : ""}
            </span>
          </Link>
        ))}

        {folder.unplaced.length > 0 ? (
          <Link
            className="folder waiting"
            href={`/office/${folder.program.key}/class/${UNPLACED}`}
          >
            <FolderIcon />
            <span className="folder-name">Not yet in a class</span>
            <span className="folder-sub">
              {folder.unplaced.length} to place
            </span>
          </Link>
        ) : null}

        <Link className="folder docs" href={`/office/${folder.program.key}/docs`}>
          <FolderIcon />
          <span className="folder-name">Admin Documents</span>
          <span className="folder-sub">
            {ready_docs} ready to print
            {ADMIN_DOCS.length > ready_docs
              ? ` · ${ADMIN_DOCS.length - ready_docs} waiting on a file`
              : ""}
          </span>
        </Link>
      </div>

      {folder.unplaced.length > 0 ? (
        <p className="note">
          {folder.unplaced.length} of these {folder.student_count} bought the program
          without the class being named on the order — "{folder.program.short_name}{" "}
          Program Deposit" rather than "{folder.program.short_name} Fall 2026". Open{" "}
          <strong>Not yet in a class</strong> to put them where they belong; until then
          they are on nobody's printed list.
        </p>
      ) : null}

      <footer>
        Read live from the store · placements, withdrawals and degrees are saved on this
        Mac only · nothing is ever written back to the store
      </footer>
    </main>
  );
}
