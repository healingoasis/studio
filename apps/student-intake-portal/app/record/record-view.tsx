"use client";

import { useState } from "react";
import Link from "next/link";
import {
  count_statuses,
  documents_for_program,
  STATUS_LABEL,
  student_documents,
  type DocStatus,
  type DocumentDef,
  type DocumentState,
} from "@/lib/documents";
import {
  CARD_FEE_RATE,
  detail_url,
  program_url,
  type ProgramGroup,
  type ShopItem,
} from "@/lib/shop";
import type { Student } from "@/lib/students";
import {
  document_href,
  UPLOAD_ACCEPT,
  useDocumentActions,
} from "../use-document-actions";
import { VersionSwitch } from "../version-switch";
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

const file_size = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

type Section = "admission" | "student" | "grades" | "evaluations" | "diploma";

const SECTIONS: { key: Section; label: string; built: boolean }[] = [
  { key: "admission", label: "Admission" },
  { key: "student", label: "Records" },
  { key: "grades", label: "Grades" },
  { key: "evaluations", label: "Evaluations" },
  { key: "diploma", label: "Diploma" },
].map((s) => ({ ...s, built: s.key === "admission" || s.key === "student" })) as {
  key: Section;
  label: string;
  built: boolean;
}[];

const NOT_BUILT: Record<string, string> = {
  grades: "Module results and overall standing will sit here once there is somewhere to read them from.",
  evaluations: "Instructor evaluations and the student's own course feedback will sit here.",
  diploma: "The certificate itself, to download once the program is passed.",
};

export default function RecordView({
  students,
  docs,
  photos,
  notes,
  programs,
  seminars,
  merchandise,
}: {
  students: Student[];
  docs: Record<string, Record<string, DocumentState>>;
  photos: Record<string, { src: string | null; alt: string }>;
  notes: Record<string, ProgramNote>;
  programs: ProgramGroup[];
  seminars: ShopItem[];
  merchandise: ShopItem[];
}) {
  const [id, set_id] = useState(students[0]?.student_id ?? "");
  // Null until the reader picks one, so the sensible default can follow the student.
  const [section, set_section] = useState<Section | null>(null);
  const [privacy, set_privacy] = useState(false);

  const { busy, problem, upload, remove, cycle } = useDocumentActions();

  const student = students.find((s) => s.student_id === id) ?? students[0];
  if (!student) return null;
  // Pinned so the card builders below keep the narrowing.
  const person = student;

  const state = docs[student.student_id] ?? {};
  const photo = photos[student.student_id];
  const note = notes[`${student.program.key}::${student.class_term ?? ""}`];

  const enrolled = student.remaining === 0 && student.paid > 0;

  const admission = documents_for_program(student.program.key);

  // An enrolled record opens closed. Nothing is expanded until a section is chosen, so
  // the page stays short and only the one area below the tabs ever changes.
  const active: Section | null = enrolled ? section : "admission";
  const built = active ? (SECTIONS.find((s) => s.key === active)?.built ?? true) : true;

  const list = active === "student" ? student_documents() : admission;
  const counts = count_statuses(list, state);

  const at_intake =
    student.standing === "nothing_paid" || student.standing === "deposit_only";
  const stage = at_intake ? "Applying" : "Enrolled";

  const done = counts.approved;
  const total = counts.required;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const other_programs = programs.filter((g) => g.key !== student.program.key);

  /** Admission paperwork: the student sends it, the office checks it. */
  function admission_card(d: DocumentDef) {
    const entry = state[d.doc_id];
    if (!entry) return null;
    const status: DocStatus = entry.status;
    const working = busy === d.doc_id;

    return (
      <article key={d.doc_id} className={`file-card ${status} ${working ? "working" : ""}`}>
        <p className="file-card-kind">{d.only_if ? "If it applies" : "Required"}</p>
        <h3>{d.name}</h3>

        {entry.file ? (
          <p className="file-card-file">
            <a href={document_href(person.student_id, d.doc_id)} target="_blank" rel="noopener noreferrer">
              {entry.file.file_name}
            </a>
            <span className="file-card-size">{file_size(entry.file.size)}</span>
          </p>
        ) : (
          <p className="file-card-empty">
            {status === "not_required" ? "Not needed for you" : "Nothing on file"}
          </p>
        )}

        <div className="file-card-act">
          <input
            type="file"
            className="visually-hidden"
            id={`rec-${d.doc_id}`}
            accept={UPLOAD_ACCEPT}
            onChange={(e) => {
              const chosen = e.target.files?.[0];
              if (chosen) upload(person.student_id, d.doc_id, chosen);
              e.target.value = "";
            }}
          />
          <label htmlFor={`rec-${d.doc_id}`} className="mini primary">
            {working ? "Sending…" : entry.file ? "Replace" : "Upload"}
          </label>
          {entry.file ? (
            <button
              type="button"
              className="mini"
              disabled={working}
              onClick={() => remove(person.student_id, d.doc_id)}
            >
              Remove
            </button>
          ) : null}
        </div>

        <div className="file-card-foot">
          <button
            type="button"
            className={`file-state ${status}`}
            disabled={working}
            title="Change the status"
            onClick={() => cycle(person.student_id, d.doc_id, status)}
          >
            {STATUS_LABEL[status]}
          </button>
          {entry.updated_on ? (
            <span className="file-when">{short_date(entry.updated_on)}</span>
          ) : null}
        </div>
      </article>
    );
  }

  /** Records the school issues: the student reads them and never uploads here. */
  function issued_card(d: DocumentDef) {
    const entry = state[d.doc_id];
    const file = entry?.file;
    const working = busy === d.doc_id;

    return (
      <article
        key={d.doc_id}
        className={`file-card ${file ? "approved" : "not_required"} ${working ? "working" : ""}`}
      >
        <p className="file-card-kind">Issued by the school</p>
        <h3>{d.name}</h3>

        {file ? (
          <p className="file-card-file">
            <a href={document_href(person.student_id, d.doc_id)} target="_blank" rel="noopener noreferrer">
              {file.file_name}
            </a>
            <span className="file-card-size">{file_size(file.size)}</span>
          </p>
        ) : (
          <p className="file-card-empty">Nothing sent yet</p>
        )}

        <div className="file-card-act">
          <input
            type="file"
            className="visually-hidden"
            id={`rec-send-${d.doc_id}`}
            accept={UPLOAD_ACCEPT}
            onChange={(e) => {
              const chosen = e.target.files?.[0];
              if (chosen) upload(person.student_id, d.doc_id, chosen);
              e.target.value = "";
            }}
          />
          <label htmlFor={`rec-send-${d.doc_id}`} className="mini">
            {working ? "Sending…" : file ? "Replace" : "Send"}
          </label>
          {file ? (
            <button
              type="button"
              className="mini"
              disabled={working}
              onClick={() => remove(person.student_id, d.doc_id)}
            >
              Withdraw
            </button>
          ) : null}
        </div>

        <div className="file-card-foot">
          <span className={`file-state ${file ? "approved" : "not_required"}`}>
            {file ? "Available" : "Not issued yet"}
          </span>
          {file ? (
            <span className="file-when">
              {short_date(file.uploaded_at.slice(0, 10))}
            </span>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <main className="file">
      <header className="file-hero">
        {photo?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.alt} />
        ) : null}
        <div className="file-hero-veil" />
        <div className="file-hero-inner">
          <p className="file-school">Healing Oasis Wellness Center</p>
          <h1 className={privacy ? "private" : ""}>{student.name}</h1>
          <p className="file-program">
            <span className="file-stage">{stage}</span>
            {student.program.full_name}
            {student.class_term ? ` · ${student.class_term}` : ""}
          </p>
        </div>
      </header>

      <div className="file-bar">
        <div className="file-bar-left">
          <VersionSwitch current="/record" />
          <button
            type="button"
            className="toggle"
            aria-pressed={privacy}
            onClick={() => set_privacy((p) => !p)}
          >
            {privacy ? "Names hidden" : "Hide names"}
          </button>
        </div>
        <div className="picker">
          <label htmlFor="file-student">Viewing</label>
          <select
            id="file-student"
            value={student.student_id}
            onChange={(e) => set_id(e.target.value)}
            className={privacy ? "private" : ""}
          >
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} — {s.program.short_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="file-note-band">
        <b>Prototype.</b> People, programs and payments are your actual students, read
        live from the store. Uploads are real and stay on this Mac. Starting paperwork
        colours are invented; anything changed from here on is real.
      </p>

      <div className="file-body">
        <section className="file-main">
          {enrolled ? (
            <nav className="file-sections" aria-label="Sections of the record">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className="file-section-tab"
                  aria-current={active === s.key ? "true" : undefined}
                  onClick={() =>
                    set_section((open) => (open === s.key ? null : s.key))
                  }
                >
                  {s.label}
                  {!s.built ? <span className="soon">soon</span> : null}
                </button>
              ))}
            </nav>
          ) : null}

          {!active ? (
            <p className="tab-closed">Choose a section above to open it.</p>
          ) : built ? (
            <>
              <div className="file-section-head">
                <h2>
                  {active === "student" ? "Records issued to you" : "Admission file"}
                </h2>
                <p>
                  {done} of {total} {active === "student" ? "issued" : "complete"}
                </p>
              </div>

              <div className="file-progress" aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>

              {problem ? (
                <p className="alert" role="alert">
                  {problem}
                </p>
              ) : null}

              <div className="file-grid">
                {list.map((d) =>
                  active === "student" ? issued_card(d) : admission_card(d)
                )}
              </div>

              <p className="file-hint">
                {active === "student"
                  ? "These are records the school sends out. Send and Withdraw are office controls; a student would not see them."
                  : "Uploading turns a card yellow — it has arrived but nobody has checked it. Click the status to move it on."}
              </p>
            </>
          ) : (
            <div className="file-empty-section">
              <p className="file-empty-title">Not built yet</p>
              <p>{NOT_BUILT[active]}</p>
              <p className="muted">
                Nothing is invented here on purpose — it will appear once there is a real
                source to read it from.
              </p>
            </div>
          )}
        </section>

        <aside className="file-aside">
          <div className={`file-seal ${privacy ? "private" : ""}`}>
            {initials(student.name)}
          </div>

          {/* Nothing owed means nothing to decide: one settled line instead of a
              three-row sum, a button and a note about a fee that will not be charged. */}
          {student.remaining > 0 ? (
            <>
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

              <Link className="btn file-pay" href={detail_url(student.program.balance_handle)}>
                Pay balance
              </Link>

              <p className="file-note">
                Figures are what the school charges. The{" "}
                {(CARD_FEE_RATE * 100).toFixed(1)}% card processing is added at checkout.
              </p>
            </>
          ) : (
            <p className="file-settled">
              Tuition settled
              <span>{money(student.paid)} paid in full</span>
            </p>
          )}

          {student.payments.length > 0 ? (
            <div className="file-ledger">
              <p className="file-ledger-head">Payments</p>
              {student.payments.map((p) => (
                <div key={p.order_number} className="file-ledger-row">
                  <span>
                    {short_date(p.paid_on)}
                    <span className="file-ledger-kind">
                      {p.kind}
                      {p.refunded ? " · refunded" : p.pending ? " · unpaid" : ""}
                    </span>
                  </span>
                  <span className={p.refunded || p.pending ? "strike" : ""}>
                    {money(p.base_amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
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

      <section className="file-strip">
        <div className="file-section-head">
          <h2>From the shop</h2>
          <p>Kit and merchandise</p>
        </div>

        <div className="file-consider">
          {merchandise.map((m) => (
            <Link key={m.handle} className="consider" href={detail_url(m.handle)}>
              <span className="consider-photo">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.image_alt} loading="lazy" />
                ) : null}
              </span>
              <span className="consider-body">
                <span className="consider-kind">
                  {m.available ? "Merchandise" : "Sold out"}
                </span>
                <span className="consider-title">{m.title}</span>
                <span className="consider-meta">{m.choices ?? "One option"}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="file-footer">
        Read live from healing-oasis-us.myshopify.com · nothing is written back to the
        store · uploaded documents stay on this Mac
      </footer>
    </main>
  );
}
