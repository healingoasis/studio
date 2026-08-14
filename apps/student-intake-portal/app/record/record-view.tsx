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
import {
  detail_url,
  program_url,
  type ProgramGroup,
  type ShopItem,
} from "@/lib/shop";
import type { Student } from "@/lib/students";
import type { ProgramNote } from "./page";

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
  notes,
  programs,
  seminars,
}: {
  students: Student[];
  docs: Record<string, Record<string, DocumentState>>;
  photos: Record<string, { src: string | null; alt: string }>;
  notes: Record<string, ProgramNote>;
  programs: ProgramGroup[];
  seminars: ShopItem[];
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

  const note = notes[`${student.program.key}::${student.class_term ?? ""}`];

  // Someone still getting in reads differently from someone already on the programme.
  const at_intake = student.standing === "nothing_paid" || student.standing === "deposit_only";
  const stage = at_intake ? "Applying" : student.remaining > 0 ? "Enrolled" : "Enrolled";

  const other_programs = programs.filter((g) => g.key !== student.program.key);

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
            <span className="file-stage">{stage}</span>
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

      {note ? (
        <section className="file-strip">
          <div className="file-section-head">
            <h2>Your program</h2>
            <Link className="file-link" href={program_url(student.program.key)}>
              Full details →
            </Link>
          </div>
          <div
            className="file-schedule product-copy"
            dangerouslySetInnerHTML={{ __html: note.description_html }}
          />
        </section>
      ) : null}

      <section className="file-strip">
        <div className="file-section-head">
          <h2>You might also consider</h2>
          <p>Open to you as a student here</p>
        </div>

        <div className="file-consider">
          {other_programs.map((g) => (
            <Link key={g.key} className="consider" href={program_url(g.key)}>
              <span className="consider-photo">
                {g.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.image} alt={g.image_alt} loading="lazy" />
                ) : null}
              </span>
              <span className="consider-body">
                <span className="consider-kind">Program</span>
                <span className="consider-title">{g.full_name}</span>
                <span className="consider-meta">
                  {g.cohorts.length === 1
                    ? "1 class open"
                    : `${g.cohorts.length} classes open`}
                </span>
              </span>
            </Link>
          ))}

          {seminars.map((s) => (
            <Link key={s.handle} className="consider" href={detail_url(s.handle)}>
              <span className="consider-photo">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.image_alt} loading="lazy" />
                ) : null}
              </span>
              <span className="consider-body">
                <span className="consider-kind">
                  {/conference/i.test(s.title) ? "Conference" : "Continuing education"}
                </span>
                <span className="consider-title">{s.title}</span>
                <span className="consider-meta">
                  {s.choices ?? "Open for registration"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="file-footer">
        A concept, shown beside the portal rather than replacing it. Same live data.
      </footer>
    </main>
  );
}
