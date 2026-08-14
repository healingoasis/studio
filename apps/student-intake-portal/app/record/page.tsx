import Link from "next/link";
import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { load_students } from "@/lib/students";
import { local_hero, local_photo_alt } from "@/lib/local_photos";
import { load_records, student_key } from "@/lib/uploads";
import RecordView from "./record-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Student file — Healing Oasis" };

/**
 * A third take, sitting beside the portal and the timeline.
 *
 * Where the portal reads as a dashboard, this reads as an academic file: the programme's
 * own photograph across the top, the student's name set like a certificate, and each
 * requirement as a card on a shelf rather than a row in a list. The money is pinned to
 * one side so it is always answerable without being the first thing seen.
 */
export default async function RecordPage() {
  let students;

  try {
    students = await load_students();
  } catch (error) {
    if (!(error instanceof SetupError)) console.error("[record]", error);
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

  return <RecordView students={students} docs={docs} photos={photos} />;
}
