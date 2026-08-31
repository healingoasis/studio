import { PROGRAMS, type Program, type ProgramKey, type Student } from "./students";
import { record_for, type OfficeRecord, type OfficeStore } from "./office_records";
import { class_label, class_slug, class_sort, SEASONS, UNPLACED } from "./class_terms";

/**
 * The office view as folders: program, then the classes inside it.
 *
 * A class is only ever guessed from what the student bought — "VSMT Fall 2026 - Remaining
 * Balance" places somebody, "VSMT Program Deposit" does not. Roughly half the roster
 * cannot be placed that way, so anyone unplaced lands in a holding folder the office
 * empties by hand. Once placed, the placement is what counts, because it is the only one
 * a person actually checked.
 */

export { class_label, class_slug, class_sort, UNPLACED };

// ---------------------------------------------------------------- entries

export type RosterEntry = {
  student: Student;
  /** The office's corrected name where there is one, otherwise the store's. */
  name: string;
  first_name: string;
  last_name: string;
  degree: string | null;
  state: string | null;
  /** The class this person is actually in, after any office placement. */
  class_slug: string;
  /** True when the class came from the product title rather than from a person. */
  auto_placed: boolean;
  dropped: boolean;
  /** The store's name is not a person's, so a card printed from it would be wrong. */
  needs_name: boolean;
  record: OfficeRecord;
};

/**
 * "Sara Benjamin" splits cleanly. "Carmen Franck Flippin" does not, so everything after
 * the first word is the surname — which is what a name tag wants anyway.
 */
function split_name(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0] as string, last: "" };
  return { first: parts[0] as string, last: parts.slice(1).join(" ") };
}

/** The store holds "null Kasten" where a first name is missing. */
function tidy_store_name(name: string): string {
  return name.replace(/\bnull\b/gi, "").replace(/\s+/g, " ").trim();
}

/**
 * Clinics buy seats for their staff, so the customer on the order is sometimes a
 * business — "Whitewater Hospital", "Fredonia Vet Clinic" — and sometimes half a person,
 * where the store has no first name. Neither belongs on a card in front of a chair, so
 * they are flagged for the office rather than quietly printed.
 */
const BUSINESS = /\b(hospital|clinic|veterinar|vet|animal|equine|center|centre|llc|inc|ltd|services|associates)\b/i;

function looks_unusable(name: string, last: string): boolean {
  if (!name || /name not on file/i.test(name)) return true;
  if (!last) return true;
  return BUSINESS.test(name);
}

export function entry_for(student: Student, records: OfficeStore): RosterEntry {
  const record = record_for(records, student.student_id);
  const name = record.display_name ?? tidy_store_name(student.name) ?? student.name;
  const { first, last } = split_name(name || "Name not on file");

  const auto = student.class_term ? class_slug(student.class_term) : null;
  const placed = record.class_slug ?? auto ?? UNPLACED;

  return {
    student,
    name: name || "Name not on file",
    first_name: first,
    last_name: last,
    degree: record.degree ?? null,
    state: record.state ?? student.state ?? null,
    class_slug: placed,
    auto_placed: !record.class_slug && auto !== null,
    dropped: record.enrollment === "dropped",
    // A name the office typed is a person's by definition; only the store's is suspect.
    needs_name: !record.display_name && looks_unusable(name, last),
    record,
  };
}

// ---------------------------------------------------------------- folders

export type ClassFolder = {
  slug: string;
  label: string;
  /** Everyone in the class, including anyone who withdrew. */
  entries: RosterEntry[];
  /** Just the people who will actually be in the room. */
  active: RosterEntry[];
};

export type ProgramFolder = {
  program: Program;
  classes: ClassFolder[];
  /** The holding folder — bought the program, never said which class. */
  unplaced: RosterEntry[];
  student_count: number;
};

const by_last_name = (a: RosterEntry, b: RosterEntry) =>
  (a.last_name || a.name).localeCompare(b.last_name || b.name) ||
  a.first_name.localeCompare(b.first_name);

export function program_folder(
  key: ProgramKey,
  students: Student[],
  records: OfficeStore
): ProgramFolder {
  const entries = students
    .filter((s) => s.program.key === key)
    .map((s) => entry_for(s, records));

  const grouped = new Map<string, RosterEntry[]>();
  const unplaced: RosterEntry[] = [];

  for (const entry of entries) {
    if (entry.class_slug === UNPLACED) {
      unplaced.push(entry);
      continue;
    }
    const list = grouped.get(entry.class_slug);
    if (list) list.push(entry);
    else grouped.set(entry.class_slug, [entry]);
  }

  const classes: ClassFolder[] = [...grouped.entries()]
    .map(([slug, list]) => ({
      slug,
      label: class_label(slug),
      entries: [...list].sort(by_last_name),
      active: list.filter((e) => !e.dropped).sort(by_last_name),
    }))
    .sort((a, b) => class_sort(a.slug) - class_sort(b.slug));

  return {
    program: PROGRAMS[key],
    classes,
    unplaced: unplaced.sort(by_last_name),
    student_count: entries.length,
  };
}

export function all_program_folders(
  students: Student[],
  records: OfficeStore
): ProgramFolder[] {
  return (Object.keys(PROGRAMS) as ProgramKey[]).map((key) =>
    program_folder(key, students, records)
  );
}

export function find_class(
  folder: ProgramFolder,
  slug: string
): ClassFolder | null {
  if (slug === UNPLACED) {
    return {
      slug: UNPLACED,
      label: "Not yet in a class",
      entries: folder.unplaced,
      active: folder.unplaced.filter((e) => !e.dropped),
    };
  }
  return folder.classes.find((c) => c.slug === slug) ?? null;
}

/**
 * Every class the office can move somebody into: the ones that exist, plus the next two
 * intakes ahead of today, so a student can be pushed forward before anyone has bought
 * into that class and created it.
 */
export function movable_classes(folder: ProgramFolder, today = new Date()): string[] {
  const slugs = new Set(folder.classes.map((c) => c.slug));

  const year = today.getFullYear();
  const month = today.getMonth();
  // Roughly: spring starts in January, summer in May, fall in August.
  const current = month < 4 ? 0 : month < 7 ? 1 : 2;

  for (let step = 0; step <= 3; step++) {
    const index = current + step;
    const season = SEASONS[index % 3] as string;
    slugs.add(`${season}-${year + Math.floor(index / 3)}`);
  }

  return [...slugs].sort((a, b) => class_sort(a) - class_sort(b));
}
