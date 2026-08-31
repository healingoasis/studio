import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { student_key } from "./uploads";

/**
 * What the office knows that the store does not.
 *
 * Shopify records what somebody bought. It does not record which class they ended up in
 * when the product title never said, whether they withdrew, whether they pushed to the
 * next intake, or what letters go after their name on a desk card. All of that is typed
 * by the office and kept here, in `.data/office-roster/` at the top of the studio folder,
 * which is never tracked by git and never leaves this Mac.
 *
 * Nothing in this file is ever written back to the store.
 */

/**
 * Moving someone to the next intake is just a change of class, so there is no separate
 * state for it — the office picks the later class and they leave the earlier list.
 */
export type Enrollment = "active" | "dropped";

export type OfficeRecord = {
  /** Set when the office placed this person by hand, or corrected a wrong placement. */
  class_slug?: string;
  enrollment?: Enrollment;
  /** Letters after the name: DVM, VMD, DC, CVT. Nowhere in the store, typed once here. */
  degree?: string;
  /** Overrides the state read off the order address. */
  state?: string;
  /** The store holds "Whitewater Hospital" and "null Kasten" where a person should be. */
  display_name?: string;
  updated_on?: string;
};

export type OfficeStore = Record<string, OfficeRecord>;

function root(): string {
  return join(process.cwd(), "..", "..", ".data", "office-roster");
}

function index_path(): string {
  return join(root(), "index.json");
}

const FIELD_LIMIT = 120;

export class OfficeError extends Error {}

/** Typed by hand, so it is trimmed, capped, and stripped of anything odd. */
function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return trimmed ? trimmed.slice(0, FIELD_LIMIT) : undefined;
}

export function valid_class_slug(slug: string): boolean {
  return /^[a-z0-9-]{1,40}$/.test(slug);
}

async function read_store(): Promise<OfficeStore> {
  try {
    const raw = await readFile(index_path(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as OfficeStore;
  } catch {
    // nothing saved yet, or the file was hand-edited into something unreadable
  }
  return {};
}

async function write_store(store: OfficeStore): Promise<void> {
  await mkdir(root(), { recursive: true });
  // Write beside the target then move, so a crash mid-write cannot truncate the index.
  const temp = join(root(), `.index-${randomUUID()}.tmp`);
  await writeFile(temp, JSON.stringify(store, null, 2), "utf8");
  await rename(temp, index_path());
}

export async function load_office_records(): Promise<OfficeStore> {
  // The review build must never carry a real person's class placement or credentials.
  if (process.env.PORTAL_DEMO === "1") return {};
  return read_store();
}

const ENROLLMENTS: Enrollment[] = ["active", "dropped"];

export type OfficePatch = {
  class_slug?: string | null;
  enrollment?: string | null;
  degree?: string | null;
  state?: string | null;
  display_name?: string | null;
};

/**
 * Applies one change from the class page. A null clears the field back to whatever the
 * store says, which is how a mistaken correction is undone.
 */
export async function save_office_record(
  student_id: string,
  patch: OfficePatch
): Promise<OfficeRecord> {
  const key = student_key(student_id);
  if (!key) throw new OfficeError("That is not a student we recognise.");

  const store = await read_store();
  const next: OfficeRecord = { ...(store[key] ?? {}) };

  if ("class_slug" in patch) {
    if (patch.class_slug === null) delete next.class_slug;
    else {
      const slug = clean(patch.class_slug);
      if (!slug || !valid_class_slug(slug)) {
        throw new OfficeError("That is not a class we know about.");
      }
      next.class_slug = slug;
    }
  }

  if ("enrollment" in patch) {
    if (patch.enrollment === null) delete next.enrollment;
    else {
      const value = clean(patch.enrollment);
      if (!value || !ENROLLMENTS.includes(value as Enrollment)) {
        throw new OfficeError("That is not a status we track.");
      }
      next.enrollment = value as Enrollment;
    }
  }

  for (const field of ["degree", "state", "display_name"] as const) {
    if (!(field in patch)) continue;
    const raw = patch[field];
    if (raw === null) delete next[field];
    else {
      const value = clean(raw);
      if (value) {
        next[field] = field === "state" ? value.toUpperCase().slice(0, 4) : value;
      } else delete next[field];
    }
  }

  next.updated_on = new Date().toISOString().slice(0, 10);

  // Only the timestamp left means every correction was cleared; drop the row entirely.
  if (Object.keys(next).length <= 1) delete store[key];
  else store[key] = next;

  await write_store(store);
  return next;
}

export function record_for(store: OfficeStore, student_id: string): OfficeRecord {
  return store[student_key(student_id)] ?? {};
}
