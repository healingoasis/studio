import { NextResponse } from "next/server";
import { STATUS_ORDER, type DocStatus } from "@/lib/documents";
import {
  remove_document,
  save_upload,
  set_status,
  UploadError,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function is_status(value: unknown): value is DocStatus {
  return typeof value === "string" && STATUS_ORDER.includes(value as DocStatus);
}

/** Turns anything thrown into one plain sentence, and keeps the detail in the terminal. */
function problem(error: unknown, fallback: string) {
  if (error instanceof UploadError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error("[student-intake] document request failed:", error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/** Upload a document. */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const student_id = form.get("student_id");
    const doc_id = form.get("doc_id");
    const file = form.get("file");

    if (typeof student_id !== "string" || typeof doc_id !== "string") {
      return NextResponse.json({ error: "Missing student or document." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was attached." }, { status: 400 });
    }

    const record = await save_upload(student_id, doc_id, file);
    return NextResponse.json({ ok: true, record });
  } catch (error) {
    return problem(error, "That upload did not go through. Please try again.");
  }
}

/** Move a document to a different status. */
export async function PATCH(request: Request) {
  try {
    const body: unknown = await request.json();
    const { student_id, doc_id, status } = (body ?? {}) as Record<string, unknown>;

    if (typeof student_id !== "string" || typeof doc_id !== "string") {
      return NextResponse.json({ error: "Missing student or document." }, { status: 400 });
    }
    if (!is_status(status)) {
      return NextResponse.json({ error: "That is not a status we use." }, { status: 400 });
    }

    await set_status(student_id, doc_id, status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error, "That change did not save. Please try again.");
  }
}

/** Remove an uploaded document and forget its status. */
export async function DELETE(request: Request) {
  try {
    const body: unknown = await request.json();
    const { student_id, doc_id } = (body ?? {}) as Record<string, unknown>;

    if (typeof student_id !== "string" || typeof doc_id !== "string") {
      return NextResponse.json({ error: "Missing student or document." }, { status: 400 });
    }

    await remove_document(student_id, doc_id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return problem(error, "That could not be removed. Please try again.");
  }
}
