import Link from "next/link";
import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { load_students } from "@/lib/students";
import { load_records, student_key } from "@/lib/uploads";
import ConceptView from "./concept-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "A different shape — Healing Oasis" };

/**
 * A second take on the same information, kept beside the first rather than replacing it.
 *
 * The portal is organised the way the school holds its records: paperwork here, money
 * there, a shop underneath. A student arriving does not have a records question, they
 * have a "what do I need to do, and by when" question — so this orders everything by
 * sequence instead of by category, and puts one action above everything else.
 */
export default async function ConceptPage() {
  let students;

  try {
    students = await load_students();
  } catch (error) {
    if (!(error instanceof SetupError)) console.error("[concept]", error);
    return (
      <main className="wrap">
        <div className="crumb">
          <Link href="/">← Back to the portal</Link>
        </div>
        <div className="setup">
          <h2>Cannot reach the store right now</h2>
          <p>Try reloading in a moment.</p>
        </div>
      </main>
    );
  }

  if (students.length === 0) return null;

  const records = await load_records();
  const docs: Record<string, Record<string, DocumentState>> = {};
  for (const s of students) {
    docs[s.student_id] = merge_documents(
      s.student_id,
      s.program.key,
      s.standing,
      records[student_key(s.student_id)]
    );
  }

  return <ConceptView students={students} docs={docs} />;
}
