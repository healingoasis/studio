"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { class_label, UNPLACED } from "@/lib/roster";

/**
 * The class list, and the four things the office can correct on it: who is in it, what
 * their name really is, the letters after it, and whether they are still coming.
 *
 * Everything a name tag needs that the store cannot answer is typed here, once.
 */

export type Row = {
  student_id: string;
  name: string;
  store_name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  degree: string | null;
  state: string | null;
  store_state: string | null;
  class_slug: string;
  auto_placed: boolean;
  dropped: boolean;
  remaining: number;
};

type Props = {
  program_key: string;
  program_name: string;
  klass: { slug: string; label: string; entries: Row[] };
  classes: string[];
};

export default function ClassView({
  program_key,
  program_name,
  klass,
  classes,
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busy, set_busy] = useState<string | null>(null);
  const [problem, set_problem] = useState<string | null>(null);

  async function save(
    student_id: string,
    patch: Record<string, string | null>
  ): Promise<void> {
    set_busy(student_id);
    set_problem(null);
    try {
      const response = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, ...patch }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        set_problem(body.error ?? "That did not save. Try once more.");
        return;
      }
      // The class this person belongs to may have just changed, so re-read the page.
      start(() => router.refresh());
    } catch {
      set_problem("That did not save. Try once more.");
    } finally {
      set_busy(null);
    }
  }

  const active = klass.entries.filter((e) => !e.dropped);
  const unplaced = klass.slug === UNPLACED;

  return (
    <>
      <div className="masthead">
        <div>
          <p className="eyebrow">
            Office · {program_name}
          </p>
          <h1>{klass.label}</h1>
        </div>
        {!unplaced && active.length > 0 ? (
          <Link
            className="print-link"
            href={`/office/${program_key}/docs/name-tags?class=${klass.slug}`}
          >
            Print name tags
          </Link>
        ) : null}
      </div>

      {problem ? <p className="problem">{problem}</p> : null}

      <section className="card">
        <div className="card-head">
          <div>
            <h2>{unplaced ? "Waiting to be placed" : "Who is in this class"}</h2>
            <p className="sub">
              {active.length} {active.length === 1 ? "student" : "students"}
              {klass.entries.length > active.length
                ? ` · ${klass.entries.length - active.length} withdrawn`
                : ""}
            </p>
          </div>
        </div>

        <p className="note tight">
          {unplaced
            ? "Their order never said which class, so they are on no printed list yet. Pick a class for each one."
            : "This is exactly who prints. Move somebody to another class, or mark them withdrawn, and they come off straight away."}
        </p>

        <div className="table-scroll">
          <table className="roster-edit">
            <thead>
              <tr>
                <th>Name</th>
                <th>Degree</th>
                <th>State</th>
                <th>Class</th>
                <th>Coming?</th>
              </tr>
            </thead>
            <tbody>
              {klass.entries.map((row) => (
                <tr
                  key={row.student_id}
                  className={row.dropped ? "is-dropped" : undefined}
                >
                  <td>
                    <Field
                      value={row.name}
                      placeholder="Name"
                      wide
                      busy={busy === row.student_id}
                      onSave={(value) =>
                        save(row.student_id, {
                          display_name: value || null,
                        })
                      }
                    />
                    <div className="roster-sub">
                      {row.store_name !== row.name
                        ? `Store has "${row.store_name}"`
                        : row.email ?? "No email on file"}
                    </div>
                  </td>
                  <td>
                    <Field
                      value={row.degree ?? ""}
                      placeholder="DVM"
                      busy={busy === row.student_id}
                      onSave={(value) =>
                        save(row.student_id, { degree: value || null })
                      }
                    />
                  </td>
                  <td>
                    <Field
                      value={row.state ?? ""}
                      placeholder="WI"
                      short
                      busy={busy === row.student_id}
                      onSave={(value) =>
                        save(row.student_id, { state: value || null })
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={row.class_slug === UNPLACED ? "" : row.class_slug}
                      disabled={busy === row.student_id || pending}
                      onChange={(event) =>
                        save(row.student_id, {
                          class_slug: event.target.value || null,
                        })
                      }
                    >
                      <option value="">Not in a class</option>
                      {classes.map((slug) => (
                        <option key={slug} value={slug}>
                          {class_label(slug)}
                        </option>
                      ))}
                    </select>
                    {row.auto_placed ? (
                      <div className="roster-sub">From the order</div>
                    ) : null}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`coming ${row.dropped ? "no" : "yes"}`}
                      disabled={busy === row.student_id || pending}
                      onClick={() =>
                        save(row.student_id, {
                          enrollment: row.dropped ? null : "dropped",
                        })
                      }
                    >
                      {row.dropped ? "Withdrawn" : "Coming"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {klass.entries.length === 0 ? (
          <p className="note tight">Nobody is in this class yet.</p>
        ) : null}

        <p className="card-foot">
          Degree is nowhere in the store, so it has to be typed once here — after that it
          sticks. State comes off the order address and can be corrected the same way.
        </p>
      </section>
    </>
  );
}

/** Saves when focus leaves or Enter is pressed, so nothing is lost and nothing nags. */
function Field({
  value,
  placeholder,
  onSave,
  busy,
  short,
  wide,
}: {
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
  busy: boolean;
  short?: boolean;
  wide?: boolean;
}) {
  const [draft, set_draft] = useState(value);

  // A refresh brings new server values; adopt them unless this field is mid-edit.
  const [seen, set_seen] = useState(value);
  if (seen !== value && draft === seen) {
    set_seen(value);
    set_draft(value);
  }

  return (
    <input
      className={`cell-input ${short ? "short" : ""} ${wide ? "wide" : ""}`}
      value={draft}
      placeholder={placeholder}
      disabled={busy}
      onChange={(event) => set_draft(event.target.value)}
      onBlur={() => {
        if (draft.trim() !== value.trim()) onSave(draft.trim());
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") set_draft(value);
      }}
    />
  );
}
