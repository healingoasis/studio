import type { PaymentStanding } from "./students";

/**
 * PRETEND DATA.
 *
 * Nothing tracks student paperwork today, so there is nothing real to read. These
 * statuses are invented — but generated from the student's own id, so a given person
 * always shows the same thing rather than reshuffling on every page load. The point is
 * to show Daniel the shape of the thing; the real version needs a document store,
 * which is a conversation with Dan because it holds student PII.
 */

export type DocStatus = "not_started" | "in_progress" | "approved" | "needs_update";

export const STATUS_ORDER: DocStatus[] = [
  "not_started",
  "in_progress",
  "approved",
  "needs_update",
];

export const STATUS_LABEL: Record<DocStatus, string> = {
  not_started: "Nothing yet",
  in_progress: "In progress",
  approved: "Good to go",
  needs_update: "Needs renewal",
};

export const STATUS_LEGEND: Record<DocStatus, string> = {
  not_started: "Red — nothing received yet",
  in_progress: "Yellow — received, being checked",
  approved: "Green — approved, nothing more needed",
  needs_update: "Orange — expiring or out of date",
};

export type DocumentDef = {
  doc_id: string;
  name: string;
  /** Documents that go stale and have to be re-sent. */
  expires?: boolean;
};

/** DRAFT LIST — Daniel needs to correct this against what the programs actually require. */
export const DOCUMENTS: DocumentDef[] = [
  { doc_id: "enrollment_application", name: "Enrollment application" },
  { doc_id: "professional_license", name: "Professional license (DVM / DC / CVT)", expires: true },
  { doc_id: "photo_id", name: "Government photo ID" },
  { doc_id: "degree_transcript", name: "Degree or transcript" },
  { doc_id: "liability_insurance", name: "Liability insurance certificate", expires: true },
  { doc_id: "rabies_immunization", name: "Rabies pre-exposure record" },
  { doc_id: "program_agreement", name: "Signed program agreement" },
  { doc_id: "emergency_contact", name: "Emergency contact & medical release" },
  { doc_id: "media_release", name: "Photo & media release" },
];

export type DocumentState = {
  status: DocStatus;
  updated_on: string | null;
  note: string | null;
};

const NOTES: Record<DocStatus, string | null> = {
  not_started: "We have nothing yet",
  in_progress: "Received, being checked by the office",
  approved: null,
  needs_update: "Expiring soon — please send a current copy",
};

/** FNV-1a, so the same student always lands on the same made-up statuses. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function pick(seed: number, standing: PaymentStanding, expires: boolean): DocStatus {
  const roll = seed % 100;

  // People further along in paying tend to be further along on paperwork, which makes
  // the demo read the way the real thing would.
  const approved_ceiling =
    standing === "paid_in_full"
      ? 74
      : standing === "partly_paid"
        ? 50
        : standing === "deposit_only"
          ? 22
          : 10;

  if (roll < approved_ceiling) {
    // Anything with an expiry date sometimes needs renewing rather than being clean.
    if (expires && roll % 7 === 0) return "needs_update";
    return "approved";
  }
  if (roll < approved_ceiling + 22) return "in_progress";
  if (expires && roll % 5 === 0) return "needs_update";
  return "not_started";
}

function fake_date(seed: number): string {
  // Spread across the eight months up to today, deterministically.
  const days = seed % 240;
  const d = new Date(Date.UTC(2026, 7, 12) - days * 86400000);
  return d.toISOString().slice(0, 10);
}

export function documents_for(
  student_id: string,
  standing: PaymentStanding
): Record<string, DocumentState> {
  const out: Record<string, DocumentState> = {};

  for (const doc of DOCUMENTS) {
    const seed = hash(student_id + ":" + doc.doc_id);
    const status = pick(seed, standing, doc.expires === true);
    out[doc.doc_id] = {
      status,
      updated_on: status === "not_started" ? null : fake_date(seed),
      note: NOTES[status],
    };
  }

  return out;
}

export function count_statuses(
  docs: Record<string, DocumentState>
): Record<DocStatus, number> {
  const counts: Record<DocStatus, number> = {
    not_started: 0,
    in_progress: 0,
    approved: 0,
    needs_update: 0,
  };
  for (const doc of DOCUMENTS) {
    const state = docs[doc.doc_id];
    if (state) counts[state.status] += 1;
  }
  return counts;
}
