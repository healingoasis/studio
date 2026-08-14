"use client";

import { useState } from "react";
import Link from "next/link";
import {
  count_statuses,
  documents_for_program,
  type DocumentDef,
  type DocumentState,
} from "@/lib/documents";
import { detail_url } from "@/lib/shop";
import type { Student } from "@/lib/students";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function long_date(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

type Stage = {
  key: string;
  state: "done" | "now" | "later";
  title: string;
  detail: string;
  action?: { label: string; href: string };
};

export default function ConceptView({
  students,
  docs,
}: {
  students: Student[];
  docs: Record<string, Record<string, DocumentState>>;
}) {
  const [id, set_id] = useState(students[0]?.student_id ?? "");
  const student = students.find((s) => s.student_id === id) ?? students[0];
  if (!student) return null;

  const list = documents_for_program(student.program.key);
  const state = docs[student.student_id] ?? {};
  const counts = count_statuses(list, state);

  /** The single most useful thing this person could do next. */
  const next_document: DocumentDef | undefined =
    list.find((d) => state[d.doc_id]?.status === "needs_update") ??
    list.find((d) => state[d.doc_id]?.status === "not_started");

  const outstanding = counts.required - counts.approved;
  const first_name = student.name.split(" ")[0] ?? student.name;

  const stages: Stage[] = [
    {
      key: "enrolled",
      state: "done",
      title: "Place held",
      detail: student.last_paid_on
        ? `Deposit received ${long_date(student.last_paid_on)}`
        : "Enrolment started",
    },
    {
      key: "paperwork",
      state: outstanding > 0 ? "now" : "done",
      title: "Your paperwork",
      detail:
        outstanding > 0
          ? `${counts.approved} of ${counts.required} received · ${outstanding} still to send`
          : "Everything received",
    },
    {
      key: "balance",
      state:
        student.remaining > 0 ? (outstanding > 0 ? "later" : "now") : "done",
      title: "Tuition balance",
      detail:
        student.remaining > 0
          ? `${money(student.remaining)} due before your first module`
          : "Paid in full — thank you",
      ...(student.remaining > 0
        ? {
            action: {
              label: "Pay balance",
              href: detail_url(student.program.balance_handle),
            },
          }
        : {}),
    },
    {
      key: "start",
      state: "later",
      title: "Module I",
      detail: student.class_term
        ? `${student.class_term} class`
        : student.program.full_name,
    },
  ];

  return (
    <main className="wrap concept">
      <div className="crumb concept-crumb">
        <Link href="/">← Back to the portal as it stands</Link>
        <span className="concept-tag">A different shape</span>
      </div>

      <header className="concept-head">
        <p className="eyebrow">Healing Oasis Wellness Center</p>
        <h1>Welcome back, {first_name}</h1>
        <p className="concept-sub">
          {student.program.full_name}
          {student.class_term ? ` · ${student.class_term} class` : ""}
        </p>

        <div className="picker concept-picker">
          <label htmlFor="concept-student">Viewing</label>
          <select
            id="concept-student"
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
      </header>

      {/* One action, above everything else. A student should never have to work out
          what to do next from a wall of statuses. */}
      {next_document ? (
        <section className="next-step">
          <p className="next-label">Do this next</p>
          <h2>{next_document.name}</h2>
          <p className="next-why">
            {state[next_document.doc_id]?.status === "needs_update"
              ? "What we have on file has expired. Send a current copy before your first module."
              : "We have not received this yet. It is needed before your first module."}
          </p>
          <div className="next-actions">
            <Link className="btn" href="/">
              Send it now
            </Link>
            <span className="next-rest">
              {outstanding > 1
                ? `${outstanding - 1} other ${
                    outstanding - 1 === 1 ? "item" : "items"
                  } after this`
                : "This is the last one"}
            </span>
          </div>
        </section>
      ) : student.remaining > 0 ? (
        <section className="next-step">
          <p className="next-label">Do this next</p>
          <h2>Settle your tuition balance</h2>
          <p className="next-why">
            Your paperwork is complete. {money(student.remaining)} is due before your
            first module.
          </p>
          <div className="next-actions">
            <Link className="btn" href={detail_url(student.program.balance_handle)}>
              Pay {money(student.remaining)}
            </Link>
          </div>
        </section>
      ) : (
        <section className="next-step settled">
          <p className="next-label">Nothing outstanding</p>
          <h2>You are all set for Module I</h2>
          <p className="next-why">
            Paperwork complete and tuition settled. We will be in touch with joining
            details before your first module.
          </p>
        </section>
      )}

      <ol className="track">
        {stages.map((s) => (
          <li key={s.key} className={`track-item ${s.state}`}>
            <span className="track-dot" aria-hidden="true" />
            <div className="track-body">
              <p className="track-title">{s.title}</p>
              <p className="track-detail">{s.detail}</p>
              {s.action ? (
                <Link className="track-action" href={s.action.href}>
                  {s.action.label} →
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <details className="everything">
        <summary>Everything else — documents, payments, seminars and the shop</summary>
        <p>
          The full record is still there, one click away. The difference is that it is no
          longer the first thing a student has to read.
        </p>
        <Link href="/">Open the full portal →</Link>
      </details>

      <footer>
        A concept, shown beside the portal rather than replacing it. Same live data.
      </footer>
    </main>
  );
}
