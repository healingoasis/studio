"use client";

import { useMemo, useState } from "react";
import {
  count_statuses,
  documents_for,
  documents_for_program,
  STATUS_LABEL,
  STATUS_LEGEND,
  STATUS_NOTE,
  STATUS_ORDER,
  type DocStatus,
  type DocumentState,
} from "@/lib/documents";
import type { PaymentStanding, Student } from "@/lib/students";

const STORE = "https://healing-oasis-us.myshopify.com/products/";

const CE_ITEMS = [
  { title: "Cranio-sacral Adjusting Techniques", price: 682.0, handle: "cranio-sacral-2026" },
  { title: "Applied Kinesiology for Veterinary Practice", price: 682.0, handle: "applied-kinesiology-2026" },
  { title: "2026 Conference Registration", price: 465.3, handle: "2026-conference-attendee-registration" },
];

const MERCH_ITEMS = [
  { title: "Hoodie", price: 51.7, handle: "hoodie" },
  { title: "Beanie", price: 20.68, handle: "beanis" },
  { title: "St Roccos Treats", price: 15.51, handle: "st-roccos-treats" },
  { title: "Black Bale", price: 224.38, handle: "bales" },
];

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

function Shelf({ items }: { items: typeof CE_ITEMS }) {
  return (
    <div className="shelf">
      {items.map((i) => (
        <a
          key={i.handle}
          className="item"
          href={STORE + i.handle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="t">{i.title}</span>
          <span className="p">{money(i.price)}</span>
        </a>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- portal

type DocMap = Record<string, Record<string, DocumentState>>;

export default function Portal({
  students,
  loaded_at,
}: {
  students: Student[];
  loaded_at: string;
}) {
  const [view, set_view] = useState<"student" | "office">("student");
  const [current_id, set_current_id] = useState(students[0]?.student_id ?? "");
  const [filter, set_filter] = useState<Filter>("all");
  const [privacy, set_privacy] = useState(false);

  // Pretend paperwork, seeded per student so it stays put between clicks.
  const [docs, set_docs] = useState<DocMap>(() => {
    const map: DocMap = {};
    for (const s of students) {
      map[s.student_id] = documents_for(s.student_id, s.program.key, s.standing);
    }
    return map;
  });

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

  function cycle(student_id: string, doc_id: string) {
    set_docs((prev) => {
      const student_docs = prev[student_id];
      if (!student_docs) return prev;
      const entry = student_docs[doc_id];
      if (!entry) return prev;

      const next_index = (STATUS_ORDER.indexOf(entry.status) + 1) % STATUS_ORDER.length;
      const next = STATUS_ORDER[next_index] ?? "not_started";

      return {
        ...prev,
        [student_id]: {
          ...student_docs,
          [doc_id]: {
            status: next,
            note: STATUS_NOTE[next],
            updated_on:
              next === "not_started" || next === "not_required"
                ? null
                : loaded_at.slice(0, 10),
          },
        },
      };
    });
  }

  if (!current) return null;

  const current_docs = docs[current.student_id] ?? {};
  const current_counts = count_statuses(current.program.key, current_docs);
  const current_list = documents_for_program(current.program.key);
  const outstanding =
    current_counts.not_started + current_counts.in_progress + current_counts.needs_update;

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
        <b>Half real.</b>
        <span>
          The people, programs, and payments below are your actual students, read live
          from the store. The <b>paperwork colours are invented</b> — nothing tracks
          documents yet, so those are there to show the shape of it. Click any document
          to change its colour. Nothing is saved and nobody is charged.
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
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <div>
                <h2>Your paperwork</h2>
                <p className="sub">
                  {current_counts.approved} of {current_counts.required} good to go ·{" "}
                  {current.program.short_name} requirements
                </p>
              </div>
              <p className="sub">Statuses are pretend</p>
            </div>
            <Legend />
            <ul className="docs">
              {current_list.map((d) => {
                const entry = current_docs[d.doc_id];
                if (!entry) return null;
                return (
                  <li key={d.doc_id}>
                    <button
                      type="button"
                      className={`doc ${entry.status}`}
                      onClick={() => cycle(current.student_id, d.doc_id)}
                    >
                      <span className="bar" />
                      <span className="doc-main">
                        <span className="name">{d.name}</span>
                        {entry.note ? <span className="note">{entry.note}</span> : null}
                        {d.only_if ? <span className="only-if">{d.only_if}</span> : null}
                      </span>
                      <span className="doc-when">{short_date(entry.updated_on)}</span>
                      <span className="doc-chip">
                        <Chip status={entry.status} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="card-foot">
              {outstanding === 0
                ? "Everything is in. Nothing else is needed."
                : `${outstanding} ${
                    outstanding === 1 ? "item still needs" : "items still need"
                  } attention. Red and orange are waiting on the student; yellow is waiting on the office.`}
            </p>
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
                  <a
                    className="btn"
                    href={STORE + current.program.balance_handle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay balance
                  </a>
                  <a
                    className="btn ghost"
                    href={STORE + current.program.balance_handle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Set up a payment plan
                  </a>
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
                <p className="sub">Seminars, the conference, and the shop</p>
              </div>
            </div>
            <p className="shelf-label">Seminars &amp; conference</p>
            <Shelf items={CE_ITEMS} />
            <p className="shelf-label">Merchandise</p>
            <Shelf items={MERCH_ITEMS} />
            <p className="card-foot">
              These open the real product pages. Nothing is added to a cart and nobody is
              charged.
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
                    const counts = count_statuses(s.program.key, s_docs);
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
        Read live from healing-oasis-us.myshopify.com · nothing is written back to the
        store, and no student data is saved anywhere
      </footer>
    </main>
  );
}
