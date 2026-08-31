"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { AdminDocDef } from "@/lib/admin_docs";
import type { TemplateStore } from "@/lib/templates";

/**
 * The document shelf. A document Daniel has already supplied prints straight from a
 * class; one he has not is an open slot that says what it is waiting for and takes the
 * file when he drops it in.
 */

type ClassOption = { slug: string; label: string; count: number };

export default function DocsView({
  program_key,
  docs,
  classes,
  templates,
}: {
  program_key: string;
  docs: AdminDocDef[];
  classes: ClassOption[];
  templates: TemplateStore;
}) {
  return (
    <div className="stack">
      {docs.map((doc) => (
        <DocCard
          key={doc.doc_id}
          doc={doc}
          program_key={program_key}
          classes={classes}
          dropped={templates[doc.doc_id]?.file_name ?? null}
        />
      ))}
    </div>
  );
}

function DocCard({
  doc,
  program_key,
  classes,
  dropped,
}: {
  doc: AdminDocDef;
  program_key: string;
  classes: ClassOption[];
  dropped: string | null;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, set_busy] = useState(false);
  const [problem, set_problem] = useState<string | null>(null);
  const [over, set_over] = useState(false);

  async function send(file: File): Promise<void> {
    set_busy(true);
    set_problem(null);
    const body = new FormData();
    body.append("doc_id", doc.doc_id);
    body.append("file", file);
    try {
      const response = await fetch("/api/templates", { method: "POST", body });
      if (!response.ok) {
        const parsed = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        set_problem(parsed.error ?? "That did not save. Try once more.");
        return;
      }
      router.refresh();
    } catch {
      set_problem("That did not save. Try once more.");
    } finally {
      set_busy(false);
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>{doc.name}</h2>
          <p className="sub">{doc.what}</p>
        </div>
        {doc.ready ? (
          <span className="chip approved">Ready</span>
        ) : (
          <span className="chip not_started">Waiting on a file</span>
        )}
      </div>

      <p className="note tight">{doc.fills}</p>

      {doc.ready ? (
        <>
          {classes.length === 0 ? (
            <p className="note tight">
              There is no class to print yet. Put some students into one first.
            </p>
          ) : (
            <div className="print-row">
              {classes.map((c) => (
                <Link
                  key={c.slug}
                  className={`print-class ${c.count === 0 ? "empty" : ""}`}
                  href={`/office/${program_key}/docs/${doc.doc_id.replace(
                    /_/g,
                    "-"
                  )}?class=${c.slug}`}
                >
                  <span className="print-class-name">{c.label} Class</span>
                  <span className="print-class-sub">
                    {c.count} {c.count === 1 ? "page" : "pages"}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {doc.source_file ? (
            <p className="card-foot">
              Laid out to match your own {doc.source_file} — same size, same font, same
              positions.
            </p>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={`dropzone ${over ? "over" : ""} ${busy ? "busy" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              set_over(true);
            }}
            onDragLeave={() => set_over(false)}
            onDrop={(event) => {
              event.preventDefault();
              set_over(false);
              const file = event.dataTransfer.files?.[0];
              if (file) void send(file);
            }}
            onClick={() => input.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") input.current?.click();
            }}
          >
            <input
              ref={input}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void send(file);
                event.target.value = "";
              }}
            />
            {busy ? (
              <p>Saving…</p>
            ) : dropped ? (
              <>
                <p className="drop-have">Got it — {dropped}</p>
                <p className="drop-sub">
                  Drop a newer one to replace it.
                </p>
              </>
            ) : (
              <>
                <p className="drop-have">Drop your {doc.name.toLowerCase()} here</p>
                <p className="drop-sub">
                  {doc.waiting_for} {" "}
                  Once it is here it gets rebuilt to match, exactly like the name tags.
                </p>
              </>
            )}
          </div>
          {problem ? <p className="problem">{problem}</p> : null}
        </>
      )}
    </section>
  );
}
