import { merge_documents, type DocumentState } from "@/lib/documents";
import { load_students } from "@/lib/students";
import { local_gallery, local_photo_alt } from "@/lib/local_photos";
import {
  class_term_of,
  load_product,
  load_shelves,
  parse_schedule,
} from "@/lib/shop";
import { load_records, student_key } from "@/lib/uploads";
import type { ProgramNote } from "../page";
import ReviewShell from "./review-shell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Student Intake Portal — review copy" };

/**
 * The student file as one self-contained page, for the link Daniel can open and share.
 *
 * It loads exactly what the real page loads, so what is reviewed is the real thing.
 * Built with PORTAL_DEMO=1, which swaps invented students in for the store's, because
 * this is the one page that is meant to leave the building.
 */
export default async function ReviewPage() {
  const students = await load_students();
  if (students.length === 0) return null;

  const [records, shelves] = await Promise.all([load_records(), load_shelves()]);

  const docs: Record<string, Record<string, DocumentState>> = {};
  const photos: Record<string, { images: string[]; alt: string }> = {};

  for (const s of students) {
    docs[s.student_id] = merge_documents(
      s.student_id,
      s.program.key,
      s.standing,
      records[student_key(s.student_id)],
      s.application
    );
    photos[s.student_id] = {
      images: local_gallery(s.program.key),
      alt: local_photo_alt(s.program.key, s.program.full_name),
    };
  }

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
      const schedule = parse_schedule(product?.description_html ?? "");
      if (schedule.length) notes[key] = { schedule, handle };
    })
  );

  return (
    <ReviewShell
      record={{
        students,
        docs,
        photos,
        notes,
        programs: shelves.programs,
        seminars: shelves.seminars,
        merchandise: shelves.merchandise,
      }}
    />
  );
}
