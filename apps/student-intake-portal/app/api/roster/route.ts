import { NextResponse } from "next/server";
import {
  OfficeError,
  save_office_record,
  type OfficePatch,
} from "@/lib/office_records";

export const dynamic = "force-dynamic";

/** Only these come off the wire; anything else in the body is ignored. */
const FIELDS = [
  "class_slug",
  "enrollment",
  "degree",
  "state",
  "display_name",
] as const;

export async function POST(request: Request) {
  if (process.env.PORTAL_DEMO === "1") {
    return NextResponse.json(
      { error: "This is the shareable copy, so nothing can be changed here." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nothing was sent." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Nothing was sent." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const student_id = input.student_id;

  if (typeof student_id !== "string" || !student_id) {
    return NextResponse.json(
      { error: "That is not a student we recognise." },
      { status: 400 }
    );
  }

  const patch: OfficePatch = {};
  for (const field of FIELDS) {
    if (!(field in input)) continue;
    const value = input[field];
    if (value === null || typeof value === "string") patch[field] = value;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to change." }, { status: 400 });
  }

  try {
    const record = await save_office_record(student_id, patch);
    return NextResponse.json({ record });
  } catch (error) {
    if (error instanceof OfficeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[student-intake] could not save an office record:", error);
    return NextResponse.json(
      { error: "That did not save. Try once more." },
      { status: 500 }
    );
  }
}
