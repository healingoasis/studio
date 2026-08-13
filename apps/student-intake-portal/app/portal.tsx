"use client";

import { useRef, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  count_statuses,
  documents_for_program,
  STATUS_LABEL,
  STATUS_LEGEND,
  STATUS_ORDER,
  student_documents,
  type DocStatus,
  type DocumentDef,
  type DocumentState,
} from "@/lib/documents";
import Link from "next/link";
import {
  detail_url,
  program_url,
  type ProgramGroup,
  type Shelves,
  type ShopItem,
} from "@/lib/shop";
import type { PaymentStanding, Student } from "@/lib/students";

/**
 * Someone applying is chasing paperwork, so that is the whole page. Someone enrolled has
 * a record that keeps growing, so the paperwork becomes one tab of several. Grades,
 * evaluations and the diploma are where this is heading; they are shown as empty tabs
 * rather than invented, so the shape is visible without pretending the data exists.
 */
type Tab = "admission" | "student" | "grades" | "evaluations" | "diploma";

const TABS: { key: Tab; label: string; built: boolean }[] = [
  { key: "admission", label: "Admission Documents", built: true },
  { key: "student", label: "Student Documents", built: true },
  { key: "grades", label: "Grades", built: false },
  { key: "evaluations", label: "Evaluations", built: false },
  { key: "diploma", label: "Diploma", built: false },
];

const NOT_BUILT: Record<string, string> = {
  grades: "Module results and overall standing would live here, once there is somewhere to read them from.",
  evaluations: "Instructor evaluations and the student's own course feedback would live here.",
  diploma: "The certificate itself, downloadable once the program is passed.",
};

const STANDING_LABEL: Record<PaymentStanding, string> = {
  nothing_paid: "Nothing paid yet",
  deposit_only: "Deposit only",
  partly_paid: "Part paid",
  paid_in_full: "Paid in full",
};

type Filter = "all" | PaymentStanding;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "nothing_paid", label: "Nothing paid" },
  { key: "deposit_only", label: "Deposit only" },
  { key: "partly_paid", label: "Part paid" },
  { key: "paid_in_full", label: "Paid in full" },
];

// ---------------------------------------------------------------- bits

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function long_date(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function short_date(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${MONTHS[m - 1]?.slice(0, 3)} ${d}, ${y}`;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

function Icon({ status }: { status: DocStatus }) {
  if (status === "not_required") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5.4 8h5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "not_started") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (status === "in_progress") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
    );
  }
  if (status === "approved") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M4.9 8.2l2.1 2.1 4.1-4.4"
          stroke="var(--surface)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M8 4.4v4.3" stroke="var(--surface)" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8" cy="11.3" r="1" fill="var(--surface)" />
    </svg>
  );
}

function Chip({ status, text }: { status: DocStatus; text?: string }) {
  return (
    <span className={`chip ${status}`}>
      <Icon status={status} />
      {text ?? STATUS_LABEL[status]}
    </span>
  );
}

function Legend() {
  return (
    <div className="legend">
      {STATUS_ORDER.map((s) => (
        <Chip key={s} status={s} text={STATUS_LEGEND[s]} />
      ))}
    </div>
  );
}

/**
 * A stand-in cover for the things the store has no photograph of — the programs, the
 * seminars, the conference. Set as type on a tinted panel rather than a stock image, so
 * it reads as a deliberate cover instead of pretending to be a photo of something.
 * The moment a real photograph is uploaded to Shopify it takes over automatically.
 */
function Cover({ title, tone, kicker }: { title: string; tone: number; kicker?: string }) {
  return (
    <span className={`cover tone-${tone % 5}`}>
      {kicker ? <span className="cover-kicker">{kicker}</span> : null}
      <span className="cover-title">{title}</span>
    </span>
  );
}

/** Steady per product, so a given seminar keeps the same colour between loads. */
function tone_of(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Merchandise, seminars and the conference, all as picture cards. */
function ItemShelf({ items }: { items: ShopItem[] }) {
  if (items.length === 0) {
    return (
      <p className="shelf-empty">
        The shop is not answering just now. It will be back on the next reload.
      </p>
    );
  }

  return (
    <div className="merch-shelf">
      {items.map((i) => (
        <Link key={i.handle} className="merch" href={detail_url(i.handle)}>
          <span className="merch-photo">
            {i.image ? (
              // Plain img on purpose: next/image wants sharp, which this workspace skips.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={i.image} alt={i.image_alt} loading="lazy" decoding="async" />
            ) : (
              <Cover
                title={i.title}
                tone={tone_of(i.handle)}
                kicker={/conference/i.test(i.title) ? "Conference" : "Seminar"}
              />
            )}
            {!i.available ? <span className="sold-out">Sold out</span> : null}
          </span>
          {/* No price on a shelf card: what a thing is comes before what it costs. The
              body is skipped entirely when the cover already says everything, rather
              than leaving an empty band under it. */}
          {i.image || i.choices ? (
            <span className="merch-body">
              {i.image ? <span className="merch-title">{i.title}</span> : null}
              {i.choices ? <span className="merch-choices">{i.choices}</span> : null}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

/**
 * One card per programme rather than per class, and no price. Which class and what it
 * costs are decisions for the programme's own page, not the shelf.
 */
function ProgramShelf({ groups }: { groups: ProgramGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="merch-shelf">
      {groups.map((g, index) => (
        <Link key={g.key} className="merch" href={program_url(g.key)}>
          <span className="merch-photo">
            <Cover title={g.short_name} kicker="Program" tone={index} />
          </span>
          <span className="merch-body">
            <span className="merch-title">{g.full_name}</span>
            <span className="merch-choices">
              {g.cohorts.length === 1
                ? "1 class open"
                : `${g.cohorts.length} classes open`}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- portal

type DocMap = Record<string, Record<string, DocumentState>>;

const file_size = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function Portal({
  students,
  docs,
  shelves,
}: {
  students: Student[];
  docs: DocMap;
  shelves: Shelves;
}) {
  const router = useRouter();
  const [view, set_view] = useState<"student" | "office">("student");
  const [current_id, set_current_id] = useState(students[0]?.student_id ?? "");
  const [filter, set_filter] = useState<Filter>("all");
  const [privacy, set_privacy] = useState(false);
  const [tab, set_tab] = useState<Tab>("admission");
  const [busy, set_busy] = useState<string | null>(null);
  const [problem, set_problem] = useState<string | null>(null);
  const [, start_transition] = useTransition();
  const file_inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const current = students.find((s) => s.student_id === current_id) ?? students[0];

  const counts_by_filter = useMemo(() => {
    const c: Record<Filter, number> = {
      all: students.length,
      nothing_paid: 0,
      deposit_only: 0,
      partly_paid: 0,
      paid_in_full: 0,
    };
    for (const s of students) c[s.standing] += 1;
    return c;
  }, [students]);

  const visible = useMemo(
    () => (filter === "all" ? students : students.filter((s) => s.standing === filter)),
    [students, filter]
  );

  /** Everything below saves for real, then asks the server for a fresh page. */
  async function send(
    key: string,
    run: () => Promise<Response>,
    fallback: string
  ): Promise<void> {
    set_busy(key);
    set_problem(null);
    try {
      const response = await run();
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        set_problem(body.error ?? fallback);
        return;
      }
      start_transition(() => router.refresh());
    } catch {
      set_problem(fallback);
    } finally {
      set_busy(null);
    }
  }

  function upload(student_id: string, doc_id: string, file: File) {
    const form = new FormData();
    form.append("student_id", student_id);
    form.append("doc_id", doc_id);
    form.append("file", file);

    void send(
      doc_id,
      () => fetch("/api/documents", { method: "POST", body: form }),
      "That upload did not go through. Please try again."
    );
  }

  function set_status(student_id: string, doc_id: string, status: DocStatus) {
    void send(
      doc_id,
      () =>
        fetch("/api/documents", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id, doc_id, status }),
        }),
      "That change did not save. Please try again."
    );
  }

  function remove(student_id: string, doc_id: string) {
    void send(
      doc_id,
      () =>
        fetch("/api/documents", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id, doc_id }),
        }),
      "That could not be removed. Please try again."
    );
  }

  function cycle(student_id: string, doc_id: string, from: DocStatus) {
    const next_index = (STATUS_ORDER.indexOf(from) + 1) % STATUS_ORDER.length;
    set_status(student_id, doc_id, STATUS_ORDER[next_index] ?? "not_started");
  }

  /**
   * Records the school has issued. Read-only for the student — they never upload here,
   * they just have the record. The office strip underneath is how something gets sent.
   */
  function record_list(student: Student, list: DocumentDef[], docs: Record<string, DocumentState>) {
    const issued = list.filter((d) => docs[d.doc_id]?.file);

    return (
      <>
        <ul className="docs">
          {list.map((d) => {
            const entry = docs[d.doc_id];
            const file = entry?.file;
            const working = busy === d.doc_id;

            return (
              <li key={d.doc_id}>
                <div className={`doc record ${file ? "issued" : "awaiting"}`}>
                  <span className="bar" />

                  <div className="doc-main">
                    <span className="name">{d.name}</span>
                    {file ? (
                      <span className="filed">
                        <a
                          href={`/api/documents/file?student_id=${encodeURIComponent(
                            student.student_id
                          )}&doc_id=${encodeURIComponent(d.doc_id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.file_name}
                        </a>{" "}
                        <span className="muted">· {file_size(file.size)}</span>
                      </span>
                    ) : (
                      <span className="note">
                        Nothing has been sent to this student yet
                      </span>
                    )}
                  </div>

                  <span className="doc-when">
                    {file ? short_date(file.uploaded_at.slice(0, 10)) : "—"}
                  </span>

                  <span className="doc-chip">
                    <span className={`chip ${file ? "approved" : "not_required"}`}>
                      <Icon status={file ? "approved" : "not_required"} />
                      {file ? "Available" : "Not issued yet"}
                    </span>
                  </span>

                  <div className="doc-actions">
                    <input
                      type="file"
                      className="visually-hidden"
                      id={`push-${d.doc_id}`}
                      accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,.doc,.docx"
                      onChange={(e) => {
                        const chosen = e.target.files?.[0];
                        if (chosen) upload(student.student_id, d.doc_id, chosen);
                        e.target.value = "";
                      }}
                    />
                    <label htmlFor={`push-${d.doc_id}`} className="mini">
                      {working ? "Sending…" : file ? "Replace" : "Send"}
                    </label>
                    {file ? (
                      <button
                        type="button"
                        className="mini"
                        disabled={working}
                        onClick={() => remove(student.student_id, d.doc_id)}
                      >
                        Withdraw
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="card-foot">
          {issued.length === 0
            ? "Nothing has been issued to this student yet."
            : `${issued.length} of ${list.length} issued.`}{" "}
          These are records the school sends out — the student reads them here and never
          uploads to this tab. <strong>Send</strong> and <strong>Withdraw</strong> are
          office controls; a student would not see them.
        </p>
      </>
    );
  }

  /** One list of documents. Used for both the admission and the student tabs. */
  function doc_list(student: Student, list: DocumentDef[], docs: Record<string, DocumentState>) {
    return (
      <ul className="docs">
        {list.map((d) => {
          const entry = docs[d.doc_id];
          if (!entry) return null;
          const working = busy === d.doc_id;

          return (
            <li key={d.doc_id}>
              <div className={`doc ${entry.status} ${working ? "working" : ""}`}>
                <span className="bar" />

                <div className="doc-main">
                  <span className="name">{d.name}</span>
                  {entry.note ? <span className="note">{entry.note}</span> : null}
                  {d.only_if ? <span className="only-if">{d.only_if}</span> : null}
                  {entry.file ? (
                    <span className="filed">
                      <a
                        href={`/api/documents/file?student_id=${encodeURIComponent(
                          student.student_id
                        )}&doc_id=${encodeURIComponent(d.doc_id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.file.file_name}
                      </a>{" "}
                      <span className="muted">
                        · {file_size(entry.file.size)} · sent{" "}
                        {short_date(entry.file.uploaded_at.slice(0, 10))}
                      </span>
                    </span>
                  ) : null}
                </div>

                <span className="doc-when">{short_date(entry.updated_on)}</span>

                <div className="doc-actions">
                  <input
                    type="file"
                    className="visually-hidden"
                    id={`file-${d.doc_id}`}
                    ref={(el) => {
                      file_inputs.current[d.doc_id] = el;
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) upload(student.student_id, d.doc_id, file);
                      e.target.value = "";
                    }}
                  />
                  <label htmlFor={`file-${d.doc_id}`} className="mini primary">
                    {working ? "Sending…" : entry.file ? "Replace" : "Upload"}
                  </label>
                  {entry.file ? (
                    <button
                      type="button"
                      className="mini"
                      disabled={working}
                      onClick={() => remove(student.student_id, d.doc_id)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="doc-chip"
                  disabled={working}
                  title="Change the status"
                  onClick={() => cycle(student.student_id, d.doc_id, entry.status)}
                >
                  <Chip status={entry.status} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (!current) return null;

  const current_docs = docs[current.student_id] ?? {};
  const admission_list = documents_for_program(current.program.key);
  const current_counts = count_statuses(admission_list, current_docs);

  // Paid in full means enrolled, and an enrolled student gets a record with tabs rather
  // than a page that is only about chasing their paperwork.
  const enrolled = current.remaining === 0 && current.paid > 0;
  const active_tab: Tab = enrolled ? tab : "admission";
  const tab_built = TABS.find((t) => t.key === active_tab)?.built ?? true;

  const shown_list =
    active_tab === "student" ? student_documents() : admission_list;
  const shown_counts = count_statuses(shown_list, current_docs);
  const shown_outstanding =
    shown_counts.not_started + shown_counts.in_progress + shown_counts.needs_update;

  return (
    <main className="wrap">
      <div className="masthead">
        <div>
          <p className="eyebrow">Healing Oasis Wellness Center</p>
          <h1>Student Intake</h1>
        </div>
        <div className="masthead-tools">
          <button
            type="button"
            className="toggle"
            aria-pressed={privacy}
            onClick={() => set_privacy((p) => !p)}
          >
            {privacy ? "Names hidden" : "Hide names"}
          </button>
          <div className="segmented" role="group" aria-label="Choose a view">
            <button
              type="button"
              aria-pressed={view === "student"}
              onClick={() => set_view("student")}
            >
              Student view
            </button>
            <button
              type="button"
              aria-pressed={view === "office"}
              onClick={() => set_view("office")}
            >
              Office view
            </button>
          </div>
        </div>
      </div>

      <p className="note-band">
        <b>Prototype.</b>
        <span>
          The people, programs, and payments are your actual students, read live from the
          store. <b>Uploads are real</b> — a file you send is saved on this Mac and stays
          there. The starting paperwork colours are invented, since nothing tracked
          documents before this; anything you upload or change from here on is real.
          Nobody is charged.
        </span>
      </p>

      {view === "student" ? (
        <div className="stack">
          <section className="card">
            <div className="identity">
              <div className={`avatar ${privacy ? "private" : ""}`}>
                {initials(current.name)}
              </div>
              <div className="identity-text">
                <h2 className={privacy ? "private" : ""}>{current.name}</h2>
                <p>
                  {current.program.full_name} ({current.program.short_name})
                  {current.class_term ? ` — ${current.class_term} class` : ""} ·{" "}
                  {STANDING_LABEL[current.standing]}
                </p>
              </div>
              <div className="picker">
                <label htmlFor="student-select">Viewing</label>
                <select
                  id="student-select"
                  value={current.student_id}
                  onChange={(e) => set_current_id(e.target.value)}
                  className={privacy ? "private" : ""}
                >
                  {students.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.name} — {s.program.short_name} · {STANDING_LABEL[s.standing]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tiles">
              <div className="tile">
                <p className="k">Tuition</p>
                <p className="v">{money(current.tuition)}</p>
                <p className="note">{current.program.short_name} program</p>
              </div>
              <div className="tile clear">
                <p className="k">Paid so far</p>
                <p className="v">{money(current.paid)}</p>
                <p className="note">
                  {current.last_paid_on
                    ? `Last payment ${short_date(current.last_paid_on)}`
                    : "No payments yet"}
                </p>
              </div>
              <div className={`tile ${current.remaining > 0 ? "owed" : "clear"}`}>
                <p className="k">Remaining balance</p>
                <p className="v">{money(current.remaining)}</p>
                <p className="note">
                  {current.remaining > 0
                    ? "Due before the first module"
                    : "Tuition settled — thank you"}
                </p>
                {current.remaining > 0 ? (
                  <Link
                    className="btn tile-pay"
                    href={detail_url(current.program.balance_handle)}
                  >
                    Pay balance
                  </Link>
                ) : null}
              </div>
            </div>
          </section>

          <section className="card">
            {enrolled ? (
              <>
                <div className="card-head">
                  <div>
                    <h2>{current.name.split(" ")[0]}&rsquo;s record</h2>
                    <p className="sub">
                      Enrolled on {current.program.short_name}
                      {current.class_term ? ` — ${current.class_term}` : ""}
                    </p>
                  </div>
                </div>
                <div className="tabs" role="tablist">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      className="tab"
                      aria-selected={tab === t.key}
                      onClick={() => set_tab(t.key)}
                    >
                      {t.label}
                      {!t.built ? <span className="soon">soon</span> : null}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="card-head">
                <div>
                  <h2>Your admission documents</h2>
                  <p className="sub">
                    {current_counts.approved} of {current_counts.required} good to go ·{" "}
                    {current.program.short_name} requirements
                  </p>
                </div>
                <p className="sub">Send a file for anything that is missing</p>
              </div>
            )}

            {/* No legend here — every row already names its own status in words. */}
            {problem && tab_built ? (
              <p className="alert" role="alert">
                {problem}
              </p>
            ) : null}

            {active_tab === "admission" ? (
              <>
                {doc_list(current, shown_list, current_docs)}
                <p className="card-foot">
                  {shown_counts.approved} of {shown_counts.required} good to go.{" "}
                  {shown_outstanding === 0
                    ? "Nothing else is needed here."
                    : `${shown_outstanding} still ${
                        shown_outstanding === 1 ? "needs" : "need"
                      } attention — red and orange are waiting on the student, yellow on the office.`}{" "}
                  Uploading turns something yellow; click the coloured label to move it
                  on.
                </p>
              </>
            ) : active_tab === "student" ? (
              record_list(current, shown_list, current_docs)
            ) : (
              <div className="empty-tab">
                <p className="empty-title">Not built yet</p>
                <p>{NOT_BUILT[tab]}</p>
                <p className="muted">
                  Nothing is invented here on purpose — it will appear once there is a
                  real source to read it from.
                </p>
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Payments</h2>
              <p className="sub">Straight from the store</p>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>What it was for</th>
                    <th>Order</th>
                    <th className="num">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {current.payments.map((p) => (
                    <tr key={p.order_number}>
                      <td>{long_date(p.paid_on)}</td>
                      <td>
                        {p.label}
                        <div className="roster-sub">
                          {p.kind}
                          {p.refunded ? " · refunded or voided" : ""}
                          {p.pending ? " · placed, not paid yet" : ""}
                        </div>
                      </td>
                      <td className="muted">{p.order_number}</td>
                      <td className={`num ${p.refunded || p.pending ? "strike" : ""}`}>
                        {money(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pay">
              {current.remaining > 0 ? (
                <>
                  <div className="pay-text">
                    <p>Remaining balance</p>
                    <div className="amount">{money(current.remaining)}</div>
                  </div>
                  <Link
                    className="btn"
                    href={detail_url(current.program.balance_handle)}
                  >
                    Pay balance
                  </Link>
                </>
              ) : (
                <div className="pay-text">
                  <p>Tuition is settled in full.</p>
                </div>
              )}
            </div>
            <p className="card-foot">
              Balances are worked out from what has come through the store, against the
              program&rsquo;s list price. Where someone paid by cheque or had the card fee
              waived, the number can be out by the fee. Not the books — a prototype.
            </p>
          </section>

          <section className="card">
            <div className="card-head">
              <div>
                <h2>Also available</h2>
                <p className="sub">From the Healing Oasis shop</p>
              </div>
            </div>

            {shelves.programs.length > 0 ? (
              <>
                <p className="shelf-label">Other programs</p>
                <ProgramShelf groups={shelves.programs} />
              </>
            ) : null}

            {shelves.seminars.length > 0 ? (
              <>
                <p className="shelf-label">Seminars &amp; conference</p>
                <ItemShelf items={shelves.seminars} />
              </>
            ) : null}

            <p className="shelf-label">Merchandise</p>
            <ItemShelf items={shelves.merchandise} />

            <p className="card-foot">
              Prices and photographs come straight from the shop. Click anything to read
              about it; the buy button is at the bottom of its page.
            </p>
          </section>
        </div>
      ) : (
        <div className="stack">
          <section className="card">
            <div className="card-head">
              <div>
                <h2>Everyone at a glance</h2>
                <p className="sub">
                  {students.length} on a program ·{" "}
                  {students.filter((s) => s.remaining > 0).length} with a balance
                </p>
              </div>
              <p className="sub">Click a student to open their page</p>
            </div>

            <div className="filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className="filter"
                  aria-pressed={filter === f.key}
                  onClick={() => set_filter(f.key)}
                >
                  {f.label}
                  <span className="n">{counts_by_filter[f.key]}</span>
                </button>
              ))}
            </div>

            <Legend />

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Program</th>
                    <th>Paperwork</th>
                    <th>Needs attention</th>
                    <th className="num">Paid</th>
                    <th className="num">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => {
                    const s_docs = docs[s.student_id] ?? {};
                    // The roster tracks getting people in, so it counts admission only.
                    const counts = count_statuses(
                      documents_for_program(s.program.key),
                      s_docs
                    );
                    return (
                      <tr
                        key={s.student_id}
                        className="roster-row"
                        onClick={() => {
                          set_current_id(s.student_id);
                          set_view("student");
                        }}
                      >
                        <td>
                          <div className={`roster-name ${privacy ? "private" : ""}`}>
                            {s.name}
                          </div>
                          <div className="roster-sub">
                            {s.last_paid_on
                              ? `Last paid ${short_date(s.last_paid_on)}`
                              : "No payments yet"}
                          </div>
                        </td>
                        <td>
                          {s.program.short_name}
                          <div className="roster-sub">
                            {s.class_term ?? "Class not recorded"}
                          </div>
                        </td>
                        <td>
                          <div className="strip">
                            {documents_for_program(s.program.key).map((d) => (
                              <i
                                key={d.doc_id}
                                className={s_docs[d.doc_id]?.status ?? "not_started"}
                              />
                            ))}
                          </div>
                          <div className="roster-sub">
                            {counts.approved} of {counts.required} ready
                          </div>
                        </td>
                        <td>
                          <div className="attention">
                            {counts.needs_update > 0 ? (
                              <Chip status="needs_update" />
                            ) : null}
                            {counts.not_started > 0 ? (
                              <span className="roster-sub">
                                {counts.not_started} missing
                              </span>
                            ) : null}
                            {counts.needs_update === 0 && counts.not_started === 0 ? (
                              <Chip
                                status={counts.in_progress > 0 ? "in_progress" : "approved"}
                              />
                            ) : null}
                          </div>
                        </td>
                        <td className="num">{money(s.paid)}</td>
                        <td className="num">
                          {s.remaining > 0 ? (
                            money(s.remaining)
                          ) : (
                            <span className="muted">Settled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="card-foot">
              Orange means a licence or insurance certificate is expiring — those are the
              ones to chase before a module starts.
            </p>
          </section>
        </div>
      )}

      <footer>
        Read live from healing-oasis-us.myshopify.com · nothing is ever written back to
        the store · uploaded documents are saved on this Mac and nowhere else
      </footer>
    </main>
  );
}
