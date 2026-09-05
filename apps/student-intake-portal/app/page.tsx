import { merge_documents, type DocumentState } from "@/lib/documents";
import { SetupError } from "@/lib/env";
import { load_students } from "@/lib/students";
import { local_gallery, local_photo_alt } from "@/lib/local_photos";
import {
  class_term_of,
  load_product,
  load_shelves,
  parse_schedule,
  program_of_handle,
  type ProgramGroup,
  type ScheduleEntry,
  type ShopItem,
} from "@/lib/shop";
import { load_records, student_key } from "@/lib/uploads";
import StudentFile from "./student-file";

export type ProgramNote = {
  /** The module dates for this student's own class, and where each one is held. */
  schedule: ScheduleEntry[];
  handle: string;
};

// Always read the store fresh. Nothing about real students is cached or written down.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * The student file, which is the whole product now.
 *
 * It reads as an academic file rather than a dashboard: the programme's photograph
 * across the top, the student's name set like a certificate, and each requirement as a
 * card. The money is pinned to one side so it is always answerable without being the
 * first thing seen. Daniel chose this over the dashboard on 2026-09-04.
 */
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

  // The class each student is actually on, so their own schedule can be shown rather
  // than a generic blurb. Loaded once per programme rather than once per student.
  const wanted = new Map<string, string>();
  for (const s of students) {
    const group = shelves.programs.find((g) => g.key === s.program.key);

    if (group) {
      const cohort =
        group.cohorts.find(
          (c) => class_term_of(c.handle).label === (s.class_term ?? "")
        ) ?? group.cohorts[0];
      if (cohort) wanted.set(`${s.program.key}::${s.class_term ?? ""}`, cohort.handle);
      continue;
    }

    // Cranio/Sacral is a fourth programme here, but the store sells it as a seminar
    // ticket, so it is not in the programme shelves at all. Its dates are on the
    // seminar product, and a student on it was seeing no schedule whatsoever.
    const seminar = shelves.seminars.find(
      (i) => program_of_handle(i.handle) === s.program.key
    );
    if (seminar) wanted.set(`${s.program.key}::${s.class_term ?? ""}`, seminar.handle);
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
    <StudentFile
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
