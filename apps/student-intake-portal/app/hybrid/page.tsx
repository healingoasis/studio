import Link from "next/link";
import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { local_hero, local_photo_alt } from "@/lib/local_photos";
import { load_shelves } from "@/lib/shop";
import { load_students } from "@/lib/students";
import { load_records, student_key } from "@/lib/uploads";
import Portal from "../portal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Student Intake — Healing Oasis" };

/**
 * The portal exactly as it works, opening with the programme's photograph and the
 * student's name. Keeps the density that makes the portal useful and borrows only the
 * gravitas from the student-file concept.
 */
export default async function HybridPage() {
  let students;

  try {
    students = await load_students();
  } catch (error) {
    if (!(error instanceof SetupError)) console.error("[hybrid]", error);
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

  const [records, shelves] = await Promise.all([load_records(), load_shelves()]);
  const docs: Record<string, Record<string, DocumentState>> = {};
  const photos: Record<string, { src: string | null; alt: string }> = {};

  for (const s of students) {
    docs[s.student_id] = merge_documents(
      s.student_id,
      s.program.key,
      s.standing,
      records[student_key(s.student_id)]
    );
    photos[s.student_id] = {
      src: local_hero(s.program.key),
      alt: local_photo_alt(s.program.key, s.program.full_name),
    };
  }

  return <Portal students={students} docs={docs} shelves={shelves} photos={photos} />;
}
