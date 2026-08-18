import { mkdir, readFile, writeFile, unlink, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { DocStatus } from "./documents";

/**
 * Local file storage for the prototype.
 *
 * Uploads land in `.data/intake-uploads/` at the top of the studio folder, which
 * `.gitignore` marks as never-tracked. Real student documents are personal data — they
 * stay on this machine, never reach the repo, and never leave for anywhere else.
 *
 * The real version needs proper storage with access control behind a login, which is a
 * Dan conversation. This is deliberately the smallest thing that lets Daniel drag a PDF
 * in and watch what happens.
 */

const MAX_BYTES = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".doc", ".docx",
]);

export const MAX_MB = MAX_BYTES / 1024 / 1024;
export const ALLOWED_LIST = "PDF, JPG, PNG, HEIC, or Word";

export type StoredFile = {
  file_name: string;
  stored_name: string;
  size: number;
  uploaded_at: string;
};

export type StoredDoc = {
  status: DocStatus;
  updated_on: string;
  file?: StoredFile;
};

/** student key -> doc_id -> record */
export type StoreShape = Record<string, Record<string, StoredDoc>>;

function root(): string {
  return join(process.cwd(), "..", "..", ".data", "intake-uploads");
}

function index_path(): string {
  return join(root(), "index.json");
}

/** Shopify ids look like gid://shopify/Customer/123 — not safe as a folder name. */
export function student_key(student_id: string): string {
  return student_id.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80);
}

export function valid_doc_id(doc_id: string): boolean {
  return /^[a-z0-9_]{1,60}$/.test(doc_id);
}

export class UploadError extends Error {}

/** Keeps a caller-supplied name from escaping the folder or carrying surprises. */
function safe_file_name(name: string): string {
  const trimmed = basename(name).replace(/[\u0000-\u001f\u007f]/g, "").trim();
  const ext = extname(trimmed).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new UploadError(
      `That file type is not accepted. Please send a ${ALLOWED_LIST} file.`
    );
  }

  const stem = trimmed
    .slice(0, trimmed.length - ext.length)
    .replace(/[^a-zA-Z0-9 ._-]+/g, "-")
    .slice(0, 90)
    .trim();

  return (stem || "document") + ext;
}

async function read_store(): Promise<StoreShape> {
  try {
    const raw = await readFile(index_path(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as StoreShape;
  } catch {
    // no store yet, or it was hand-edited into something unreadable
  }
  return {};
}

async function write_store(store: StoreShape): Promise<void> {
  await mkdir(root(), { recursive: true });
  // Write beside the target then move, so a crash mid-write cannot truncate the index.
  const temp = join(root(), `.index-${randomUUID()}.tmp`);
  await writeFile(temp, JSON.stringify(store, null, 2), "utf8");
  await rename(temp, index_path());
}

export async function load_records(): Promise<StoreShape> {
  // Real uploaded paperwork never belongs in the review build.
  if (process.env.PORTAL_DEMO === "1") return {};
  return read_store();
}

export async function save_upload(
  student_id: string,
  doc_id: string,
  file: File
): Promise<StoredDoc> {
  if (!valid_doc_id(doc_id)) throw new UploadError("That is not a document we track.");
  if (file.size === 0) throw new UploadError("That file appears to be empty.");
  if (file.size > MAX_BYTES) {
    throw new UploadError(`That file is too big. The limit is ${MAX_MB} MB.`);
  }

  const key = student_key(student_id);
  if (!key) throw new UploadError("That is not a student we recognise.");

  const file_name = safe_file_name(file.name || "document.pdf");
  const stored_name = `${doc_id}-${randomUUID()}${extname(file_name)}`;

  const folder = join(root(), key);
  await mkdir(folder, { recursive: true });
  await writeFile(
    join(folder, stored_name),
    Buffer.from(await file.arrayBuffer())
  );

  const store = await read_store();
  const existing = store[key]?.[doc_id];

  // Replacing a document leaves the old file behind otherwise.
  if (existing?.file) await remove_file(key, existing.file.stored_name);

  const record: StoredDoc = {
    // Something has arrived but nobody has checked it, which is exactly yellow.
    status: "in_progress",
    updated_on: new Date().toISOString().slice(0, 10),
    file: {
      file_name,
      stored_name,
      size: file.size,
      uploaded_at: new Date().toISOString(),
    },
  };

  store[key] = { ...(store[key] ?? {}), [doc_id]: record };
  await write_store(store);
  return record;
}

export async function set_status(
  student_id: string,
  doc_id: string,
  status: DocStatus
): Promise<void> {
  if (!valid_doc_id(doc_id)) throw new UploadError("That is not a document we track.");

  const key = student_key(student_id);
  if (!key) throw new UploadError("That is not a student we recognise.");

  const store = await read_store();
  const existing = store[key]?.[doc_id];

  store[key] = {
    ...(store[key] ?? {}),
    [doc_id]: {
      status,
      updated_on: new Date().toISOString().slice(0, 10),
      ...(existing?.file ? { file: existing.file } : {}),
    },
  };

  await write_store(store);
}

async function remove_file(key: string, stored_name: string): Promise<void> {
  // stored_name is generated here, never caller-supplied, but check anyway.
  if (!/^[a-z0-9_]+-[a-f0-9-]+\.[a-z0-9]+$/i.test(stored_name)) return;
  const path = join(root(), key, stored_name);
  if (existsSync(path)) {
    try {
      await unlink(path);
    } catch {
      // already gone
    }
  }
}

export async function remove_document(
  student_id: string,
  doc_id: string
): Promise<void> {
  if (!valid_doc_id(doc_id)) throw new UploadError("That is not a document we track.");

  const key = student_key(student_id);
  if (!key) throw new UploadError("That is not a student we recognise.");

  const store = await read_store();
  const existing = store[key]?.[doc_id];
  if (!existing) return;

  if (existing.file) await remove_file(key, existing.file.stored_name);

  const remaining = { ...(store[key] ?? {}) };
  delete remaining[doc_id];

  if (Object.keys(remaining).length === 0) delete store[key];
  else store[key] = remaining;

  await write_store(store);
}

export async function read_stored_file(
  student_id: string,
  doc_id: string
): Promise<{ bytes: Buffer; file_name: string } | null> {
  if (!valid_doc_id(doc_id)) return null;

  const key = student_key(student_id);
  if (!key) return null;

  const record = (await read_store())[key]?.[doc_id];
  if (!record?.file) return null;

  try {
    const bytes = await readFile(join(root(), key, record.file.stored_name));
    return { bytes, file_name: record.file.file_name };
  } catch {
    return null;
  }
}
