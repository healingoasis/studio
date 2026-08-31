"use client";

import { useMemo, useState } from "react";
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
  CARD_FEE_RATE,
  detail_url,
  program_url,
  type ProgramGroup,
  type Shelves,
  type ShopItem,
} from "@/lib/shop";
import type { PaymentStanding, Student } from "@/lib/students";
import { Cover, tone_of } from "./cover";
import {
  document_href,
  UPLOAD_ACCEPT,
  useDocumentActions,
} from "./use-document-actions";
import { VersionSwitch } from "./version-switch";

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

/** Same mark as the office folder pages, so opening one lands somewhere familiar. */
function FolderIcon() {
  return (
    <svg className="folder-icon" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path
        d="M1 4.5A2.5 2.5 0 0 1 3.5 2h5.2c.7 0 1.35.32 1.78.87l1.1 1.4c.2.25.5.4.83.4H20.5A2.5 2.5 0 0 1 23 7.17V15.5a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 1 15.5z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M1 4.5A2.5 2.5 0 0 1 3.5 2h5.2c.7 0 1.35.32 1.78.87l1.1 1.4c.2.25.5.4.83.4H20.5A2.5 2.5 0 0 1 23 7.17V15.5a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 1 15.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
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
            {g.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.image} alt={g.image_alt} loading="lazy" decoding="async" />
            ) : (
              <Cover title={g.short_name} kicker="Program" tone={index} />
            )}
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
  photos,
}: {
  students: Student[];
  docs: DocMap;
  shelves: Shelves;
  /** When given, the page opens with the student's programme photograph. */
  photos?: Record<string, { src: string | null; alt: string }>;
}) {
  const router = useRouter();
  const [view, set_view] = useState<"student" | "office">("student");
  const [current_id, set_current_id] = useState(students[0]?.student_id ?? "");
  const [filter, set_filter] = useState<Filter>("all");
  const [privacy, set_privacy] = useState(false);
  // Null until the reader picks one, so the sensible default can follow the student.
  const [tab, set_tab] = useState<Tab | null>(null);
  const { busy, problem, upload, remove, cycle } = useDocumentActions();

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

  /**
   * One folder per program that actually has people on it, with a count of the distinct
   * classes underneath. Built from the students themselves rather than from the program
   * table, because this component runs in the browser and that table reaches the store.
   */
  const program_folders = useMemo(() => {
    const seen = new Map<
      string,
      { key: string; short_name: string; count: number; terms: Set<string> }
    >();
    for (const s of students) {
      const found = seen.get(s.program.key);
      const folder =
        found ??
        {
          key: s.program.key,
          short_name: s.program.short_name,
          count: 0,
          terms: new Set<string>(),
        };
      folder.count += 1;
      if (s.class_term) folder.terms.add(s.class_term);
      if (!found) seen.set(s.program.key, folder);
    }
    return [...seen.values()].map((f) => ({
      key: f.key,
      short_name: f.short_name,
      count: f.count,
      classes: f.terms.size,
    }));
  }, [students]);

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
                          href={document_href(student.student_id, d.doc_id)}
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
                      accept={UPLOAD_ACCEPT}
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
                        href={document_href(student.student_id, d.doc_id)}
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
                    accept={UPLOAD_ACCEPT}
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

  // An enrolled record opens closed. Nothing is expanded until a section is chosen, so
  // the page stays short and only the one area below the tabs ever changes.
  const active_tab: Tab | null = enrolled ? tab : "admission";
  const tab_built = active_tab
    ? (TABS.find((t) => t.key === active_tab)?.built ?? true)
    : true;

  const shown_list =
    active_tab === "student" ? student_documents() : admission_list;
  const shown_counts = count_statuses(shown_list, current_docs);
  const shown_outstanding =
    shown_counts.not_started + shown_counts.in_progress + shown_counts.needs_update;

  const hero = photos?.[current.student_id];
  const show_hero = Boolean(hero?.src) && view === "student";

  return (
    <main className={`wrap ${show_hero ? "wrap-hero" : ""}`}>
      {show_hero && hero?.src ? (
        <div className="portal-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.src} alt={hero.alt} />
          <div className="portal-hero-veil" />
          <div className="portal-hero-inner">
            <p className="file-school">Healing Oasis Wellness Center</p>
            <h1 className={privacy ? "private" : ""}>{current.name}</h1>
            <p className="file-program">
              {current.program.full_name}
              {current.class_term ? ` · ${current.class_term}` : ""}
            </p>
          </div>
        </div>
      ) : null}

      <div className="masthead">
        <div>
          {show_hero ? (
            <p className="masthead-quiet">Student intake</p>
          ) : (
            <>
              <p className="eyebrow">Healing Oasis Wellness Center</p>
              <h1>Student Intake</h1>
            </>
          )}
        </div>
        <div className="masthead-tools">
          <VersionSwitch current="/" />
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
        {process.env.NEXT_PUBLIC_PORTAL_DEMO === "1" ? (
          <span>
            <b>Review copy.</b> The ten people here are invented, and so are their order
            numbers and email addresses — no real student record leaves the school for
            this page. The programs, prices and photographs are real. Uploading and
            changing paperwork is switched off; everything else works.
          </span>
        ) : (
          <span>
            The people, programs, and payments are your actual students, read live from the
            store. <b>Uploads are real</b> — a file you send is saved on this Mac and stays
            there. The starting paperwork colours are invented, since nothing tracked
            documents before this; anything you upload or change from here on is real.
            Nobody is charged.
          </span>
        )}
      </p>

      {view === "student" ? (
        <div className="stack">
          <section className="card">
            <div className="identity">
              {/* The hero above already carries the name and programme. */}
              {!show_hero ? (
                <>
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
                </>
              ) : (
                <div className="identity-text">
                  <p className="identity-standing">
                    {STANDING_LABEL[current.standing]}
                  </p>
                </div>
              )}
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
                      aria-selected={active_tab === t.key}
                      onClick={() =>
                        set_tab((open) => (open === t.key ? null : t.key))
                      }
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
            ) : active_tab ? (
              <div className="empty-tab">
                <p className="empty-title">Not built yet</p>
                <p>{NOT_BUILT[active_tab]}</p>
                <p className="muted">
                  Nothing is invented here on purpose — it will appear once there is a
                  real source to read it from.
                </p>
              </div>
            ) : (
              <p className="tab-closed">Choose a section above to open it.</p>
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
                        {money(p.base_amount)}
                        {/* The card was charged more than this; show it so the row can
                            be matched against a bank statement. */}
                        {p.base_amount !== p.amount ? (
                          <div className="charged">{money(p.amount)} charged</div>
                        ) : null}
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
              Every figure here is what the school charges, with card processing taken
              out. The {(CARD_FEE_RATE * 100).toFixed(1)}% is added at checkout, where
              paying by card or by check is chosen. Worked out from what has come through
              the store — a prototype, not the books.
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
                <h2>Classes and paperwork</h2>
                <p className="sub">
                  Open a program to find its classes and the documents that print from
                  them
                </p>
              </div>
            </div>

            <div className="folders">
              {program_folders.map((f) => (
                <Link key={f.key} className="folder" href={`/office/${f.key}`}>
                  <FolderIcon />
                  <span className="folder-name">{f.short_name}</span>
                  <span className="folder-sub">
                    {f.count} {f.count === 1 ? "student" : "students"}
                    {f.classes > 0
                      ? ` · ${f.classes} ${f.classes === 1 ? "class" : "classes"}`
                      : ""}
                  </span>
                </Link>
              ))}
            </div>

            <p className="card-foot">
              Desk name tags print from here, from the class exactly as it stands.
            </p>
          </section>

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
