import Link from "next/link";
import { load_students, PROGRAMS, type ProgramKey } from "@/lib/students";
import { load_office_records } from "@/lib/office_records";
import { program_folder } from "@/lib/roster";
import { SetupError } from "@/lib/env";
import { ADMIN_DOCS } from "@/lib/admin_docs";
import { FolderIcon } from "./folder-icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Admin Portal — Healing Oasis" };

/**
 * The front door of the office side.
 *
 * There is one address to remember — /office — and everything the office does hangs off
 * it. It deliberately does not lead with the student's own page: someone who came here
 * came to run a class, not to look at their own paperwork.
 */
export default async function OfficeHome() {
  let students;
  try {
    students = await load_students();
  } catch (error) {
    const friendly =
      error instanceof SetupError
        ? error.message
        : "The store did not answer just now. It is usually a passing thing — try reloading in a moment.";
    console.error("[student-intake] could not load students:", error);
    return (
      <main className="wrap">
        <div className="masthead">
          <div>
            <p className="eyebrow">Healing Oasis Wellness Center</p>
            <h1>Admin Portal</h1>
          </div>
        </div>
        <div className="setup">
          <h2>Cannot reach the store right now</h2>
          <p>{friendly}</p>
        </div>
      </main>
    );
  }

  const records = await load_office_records();
  const folders = (Object.keys(PROGRAMS) as ProgramKey[])
    .map((key) => program_folder(key, students, records))
    .filter((f) => f.student_count > 0);

  const to_place = folders.reduce((sum, f) => sum + f.unplaced.length, 0);
  const ready_docs = ADMIN_DOCS.filter((d) => d.ready).length;

  return (
    <main className="wrap">
      <div className="masthead">
        <div>
          <p className="eyebrow">Healing Oasis Wellness Center</p>
          <h1>Admin Portal</h1>
        </div>
        <Link className="print-link ghost" href="/">
          Student view
        </Link>
      </div>

      <p className="note">
        Open a program to find its classes and the documents that print from them.{" "}
        {ready_docs === 1 ? "One document is" : `${ready_docs} documents are`} ready:
        the desk name tags, which print the class exactly as it stands.
      </p>

      <div className="folders">
        {folders.map((f) => (
          <Link key={f.program.key} className="folder" href={`/office/${f.program.key}`}>
            <FolderIcon />
            <span className="folder-name">{f.program.short_name}</span>
            <span className="folder-sub">
              {f.student_count} {f.student_count === 1 ? "student" : "students"}
              {f.classes.length > 0
                ? ` · ${f.classes.length} ${
                    f.classes.length === 1 ? "class" : "classes"
                  }`
                : ""}
              {f.unplaced.length > 0 ? ` · ${f.unplaced.length} to place` : ""}
            </span>
          </Link>
        ))}
      </div>

      {to_place > 0 ? (
        <p className="note warn-note">
          {to_place} {to_place === 1 ? "student is" : "students are"} not in a class yet,
          because the order never named one. Until they are placed they are on nobody&rsquo;s
          printed list.
        </p>
      ) : null}

      <footer>
        Read live from the store · placements, withdrawals and degrees are saved on this
        Mac only · nothing is ever written back to the store
      </footer>
    </main>
  );
}
