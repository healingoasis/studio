import { mkdir, readFile, writeFile, rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Where Daniel's own office documents land when he drops one in.
 *
 * These are the school's forms — the desk name tag, the diploma — and the portal cannot
 * invent them. Dropping the real file here is what lets its layout be measured and
 * rebuilt so the portal can fill it with an actual class. The file itself stays on this
 * Mac in `.data/office-templates/`, which git never tracks.
 */

const MAX_BYTES = 20 * 1024 * 1024;
export const MAX_MB = MAX_BYTES / 1024 / 1024;

const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg",
]);

export const ALLOWED_LIST = "PDF, Word, PNG or JPG";

export type StoredTemplate = {
  file_name: string;
  stored_name: string;
  size: number;
  uploaded_at: string;
};

export type TemplateStore = Record<string, StoredTemplate>;

export class TemplateError extends Error {}

function root(): string {
  return join(process.cwd(), "..", "..", ".data", "office-templates");
}

function index_path(): string {
  return join(root(), "index.json");
}

export function valid_doc_id(doc_id: string): boolean {
  return /^[a-z0-9_]{1,60}$/.test(doc_id);
}

function safe_file_name(name: string): string {
  const trimmed = basename(name).replace(/[\u0000-\u001f\u007f]/g, "").trim();
  const ext = extname(trimmed).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new TemplateError(
      `That file type is not accepted. Please send a ${ALLOWED_LIST} file.`
    );
  }

  const stem = trimmed
    .slice(0, trimmed.length - ext.length)
    .replace(/[^a-zA-Z0-9 ._-]+/g, "-")
    .slice(0, 90)
    .trim();

  return (stem || "template") + ext;
}

async function read_store(): Promise<TemplateStore> {
  try {
    const raw = await readFile(index_path(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as TemplateStore;
  } catch {
    // nothing dropped yet
  }
  return {};
}

async function write_store(store: TemplateStore): Promise<void> {
  await mkdir(root(), { recursive: true });
  const temp = join(root(), `.index-${randomUUID()}.tmp`);
  await writeFile(temp, JSON.stringify(store, null, 2), "utf8");
  await rename(temp, index_path());
}

export async function load_templates(): Promise<TemplateStore> {
  if (process.env.PORTAL_DEMO === "1") return {};
  return read_store();
}

export async function save_template(
  doc_id: string,
  file: File
): Promise<StoredTemplate> {
  if (!valid_doc_id(doc_id)) throw new TemplateError("That is not a document we track.");
  if (file.size === 0) throw new TemplateError("That file appears to be empty.");
  if (file.size > MAX_BYTES) {
    throw new TemplateError(`That file is too big. The limit is ${MAX_MB} MB.`);
  }

  const file_name = safe_file_name(file.name || "template.pdf");
  const stored_name = `${doc_id}-${randomUUID()}${extname(file_name)}`;

  await mkdir(root(), { recursive: true });
  await writeFile(join(root(), stored_name), Buffer.from(await file.arrayBuffer()));

  const store = await read_store();
  const existing = store[doc_id];

  // Replacing a template leaves the old file behind otherwise.
  if (existing) await remove_file(existing.stored_name);

  const record: StoredTemplate = {
    file_name,
    stored_name,
    size: file.size,
    uploaded_at: new Date().toISOString(),
  };

  store[doc_id] = record;
  await write_store(store);
  return record;
}

async function remove_file(stored_name: string): Promise<void> {
  // stored_name is generated here, never caller-supplied, but check anyway.
  if (!/^[a-z0-9_]+-[a-f0-9-]+\.[a-z0-9]+$/i.test(stored_name)) return;
  const path = join(root(), stored_name);
  if (existsSync(path)) {
    try {
      await unlink(path);
    } catch {
      // already gone
    }
  }
}

export async function read_template(
  doc_id: string
): Promise<{ bytes: Buffer; file_name: string } | null> {
  if (!valid_doc_id(doc_id)) return null;
  const record = (await read_store())[doc_id];
  if (!record) return null;

  try {
    const bytes = await readFile(join(root(), record.stored_name));
    return { bytes, file_name: record.file_name };
  } catch {
    return null;
  }
}
