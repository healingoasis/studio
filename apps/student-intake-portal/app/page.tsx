import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { load_students } from "@/lib/students";
import { load_records, student_key } from "@/lib/uploads";
import Portal from "./portal";

// Always read the store fresh. Nothing about real students is cached or written down.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  let students;

  try {
    students = await load_students();
  } catch (error) {
    const friendly =
      error instanceof SetupError
        ? error.message
        : "The store did not answer just now. It is usually a passing thing — try reloading in a moment.";

    // The real reason goes to the terminal, not to Daniel's screen.
    console.error("[student-intake] could not load students:", error);

    return (
      <main className="wrap">
        <div className="masthead">
          <div>
            <p className="eyebrow">Healing Oasis Wellness Center</p>
            <h1>Student Intake</h1>
          </div>
        </div>
        <div className="setup">
          <h2>Cannot reach the store right now</h2>
          <p>{friendly}</p>
          <p>
            Nothing is broken on your end, and nothing has been lost. If reloading does
            not help, this one is for Dan.
          </p>
        </div>
      </main>
    );
  }

  if (students.length === 0) {
    return (
      <main className="wrap">
        <div className="masthead">
          <div>
            <p className="eyebrow">Healing Oasis Wellness Center</p>
            <h1>Student Intake</h1>
          </div>
        </div>
        <div className="setup">
          <h2>No program students found</h2>
          <p>
            The store answered, but none of the recent orders were for VSMT, VMRT, or
            Acupuncture — only merchandise, seminars, or conference tickets.
          </p>
        </div>
      </main>
    );
  }

  // Anything really uploaded or actioned overrides the invented paperwork statuses.
  const records = await load_records();
  const docs: Record<string, Record<string, DocumentState>> = {};

  for (const student of students) {
    docs[student.student_id] = merge_documents(
      student.student_id,
      student.program.key,
      student.standing,
      records[student_key(student.student_id)]
    );
  }

  return <Portal students={students} docs={docs} />;
}
