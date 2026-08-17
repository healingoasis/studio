import Link from "next/link";
import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { load_students } from "@/lib/students";
import { local_gallery, local_photo_alt } from "@/lib/local_photos";
import {
  class_term_of,
  load_product,
  load_shelves,
  type ProgramGroup,
  type ShopItem,
} from "@/lib/shop";
import { load_records, student_key } from "@/lib/uploads";
import RecordView from "./record-view";

export type ProgramNote = {
  /** The store's own description of the class this student is on. */
  description_html: string;
  handle: string;
};

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

  const [records, shelves] = await Promise.all([load_records(), load_shelves()]);

  const docs: Record<string, Record<string, DocumentState>> = {};
  const photos: Record<string, { images: string[]; alt: string }> = {};

  for (const s of students) {
    docs[s.student_id] = merge_documents(
      s.student_id,
      s.program.key,
      s.standing,
      records[student_key(s.student_id)]
    );
    photos[s.student_id] = {
      images: local_gallery(s.program.key),
      alt: local_photo_alt(s.program.key, s.program.full_name),
    };
  }

  // The class each student is actually on, so their own schedule can be shown rather
  // than a generic blurb. Loaded once per programme rather than once per student.
  const wanted = new Map<string, string>();
  for (const s of students) {
    const group = shelves.programs.find((g) => g.key === s.program.key);
    if (!group) continue;
    const cohort =
      group.cohorts.find(
        (c) => class_term_of(c.handle).label === (s.class_term ?? "")
      ) ?? group.cohorts[0];
    if (cohort) wanted.set(`${s.program.key}::${s.class_term ?? ""}`, cohort.handle);
  }

  const notes: Record<string, ProgramNote> = {};
  await Promise.all(
    [...wanted.entries()].map(async ([key, handle]) => {
      const product = await load_product(handle);
      if (product?.description_html) {
        notes[key] = { description_html: product.description_html, handle };
      }
    })
  );

  return (
    <RecordView
      students={students}
      docs={docs}
      photos={photos}
      notes={notes}
      programs={shelves.programs satisfies ProgramGroup[]}
      seminars={shelves.seminars satisfies ShopItem[]}
      merchandise={shelves.merchandise satisfies ShopItem[]}
    />
  );
}
