import { extname } from "node:path";
import { NextResponse } from "next/server";
import { read_stored_file } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".webp": "image/webp",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Hands back a document someone uploaded, so it can be opened and checked. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const student_id = url.searchParams.get("student_id");
  const doc_id = url.searchParams.get("doc_id");

  if (!student_id || !doc_id) {
    return NextResponse.json({ error: "Missing student or document." }, { status: 400 });
  }

  const found = await read_stored_file(student_id, doc_id);
  if (!found) {
    return NextResponse.json({ error: "No document on file." }, { status: 404 });
  }

  const type =
    CONTENT_TYPES[extname(found.file_name).toLowerCase()] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(found.bytes), {
    headers: {
      "Content-Type": type,
      // Quotes escaped so a name containing one cannot break out of the header.
      "Content-Disposition": `inline; filename="${found.file_name.replace(/"/g, "")}"`,
      "Cache-Control": "no-store",
    },
  });
}
