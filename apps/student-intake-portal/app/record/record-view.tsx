"use client";

import { useState } from "react";
import Link from "next/link";
import {
  count_statuses,
  documents_for_program,
  STATUS_LABEL,
  type DocStatus,
  type DocumentState,
} from "@/lib/documents";
import { detail_url } from "@/lib/shop";
import type { Student } from "@/lib/students";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function short_date(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function RecordView({
  students,
  docs,
  photos,
}: {
  students: Student[];
  docs: Record<string, Record<string, DocumentState>>;
  photos: Record<string, { src: string | null; alt: string }>;
}) {
  const [id, set_id] = useState(students[0]?.student_id ?? "");
  const student = students.find((s) => s.student_id === id) ?? students[0];
  if (!student) return null;

  const list = documents_for_program(student.program.key);
  const state = docs[student.student_id] ?? {};
  const counts = count_statuses(list, state);
  const photo = photos[student.student_id];

  const done = counts.approved;
  const total = counts.required;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="file">
      {/* The programme's own photograph, with the student set into it like a certificate
          header. A school, not a control panel. */}
      <header className="file-hero">
        {photo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.alt} />
        ) : null}
        <div className="file-hero-veil" />
        <div className="file-hero-inner">
          <p className="file-school">Healing Oasis Wellness Center</p>
          <h1>{student.name}</h1>
          <p className="file-program">
            {student.program.full_name}
            {student.class_term ? ` · ${student.class_term}` : ""}
          </p>
        </div>
      </header>

      <div className="file-bar">
        <Link href="/" className="file-back">
          ← Back to the portal
        </Link>
        <div className="picker">
          <label htmlFor="file-student">Viewing</label>
          <select
            id="file-student"
            value={student.student_id}
            onChange={(e) => set_id(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="file-body">
        <section className="file-main">
          <div className="file-section-head">
            <h2>Admission file</h2>
            <p>
              {done} of {total} complete
            </p>
          </div>

          <div className="file-progress" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>

          <div className="file-grid">
            {list.map((d) => {
              const entry = state[d.doc_id];
              if (!entry) return null;
              const status: DocStatus = entry.status;

              return (
                <article key={d.doc_id} className={`file-card ${status}`}>
                  <p className="file-card-kind">
                    {d.only_if ? "If it applies" : "Required"}
                  </p>
                  <h3>{d.name}</h3>

                  {entry.file ? (
                    <p className="file-card-file">
                      <span className="file-glyph" aria-hidden="true">
                        ▤
                      </span>
                      {entry.file.file_name}
                    </p>
                  ) : (
                    <p className="file-card-empty">
                      {status === "not_required"
                        ? "Not needed for you"
                        : "Nothing on file"}
                    </p>
                  )}

                  <div className="file-card-foot">
                    <span className={`file-state ${status}`}>
                      {STATUS_LABEL[status]}
                    </span>
                    {entry.updated_on ? (
                      <span className="file-when">
                        {short_date(entry.updated_on)}
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="file-aside">
          <div className="file-seal">{initials(student.name)}</div>

          <dl className="file-money">
            <div>
              <dt>Tuition</dt>
              <dd>{money(student.tuition)}</dd>
            </div>
            <div>
              <dt>Paid</dt>
              <dd>{money(student.paid)}</dd>
            </div>
            <div className="file-money-due">
              <dt>Balance</dt>
              <dd>{money(student.remaining)}</dd>
            </div>
          </dl>

          {student.remaining > 0 ? (
            <Link
              className="btn file-pay"
              href={detail_url(student.program.balance_handle)}
            >
              Pay balance
            </Link>
          ) : (
            <p className="file-settled">Tuition settled</p>
          )}

          <p className="file-note">
            Figures are what the school charges. Card processing is added at checkout.
          </p>
        </aside>
      </div>

      <footer className="file-footer">
        A concept, shown beside the portal rather than replacing it. Same live data.
      </footer>
    </main>
  );
}
