import { NextResponse } from "next/server";
import { save_template, TemplateError } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (process.env.PORTAL_DEMO === "1") {
    return NextResponse.json(
      { error: "This is the shareable copy, so nothing can be added here." },
      { status: 403 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Nothing was sent." }, { status: 400 });
  }

  const doc_id = form.get("doc_id");
  const file = form.get("file");

  if (typeof doc_id !== "string" || !doc_id) {
    return NextResponse.json(
      { error: "That is not a document we track." },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file came through." }, { status: 400 });
  }

  try {
    const record = await save_template(doc_id, file);
    return NextResponse.json({ template: record });
  } catch (error) {
    if (error instanceof TemplateError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[student-intake] could not save a template:", error);
    return NextResponse.json(
      { error: "That did not save. Try once more." },
      { status: 500 }
    );
  }
}
