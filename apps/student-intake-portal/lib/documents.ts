import type { PaymentStanding, ProgramKey } from "./students";

/**
 * The document LIST is real — taken from the three programme application forms plus the
 * Cranio/Sacral seminar form (Healing Oasis Admissions Requirements Comparison, 2026).
 *
 * The document STATUSES are invented. Nothing tracks paperwork in Shopify, so there is
 * nothing to read. They are generated from the student's own id so a given person always
 * shows the same thing rather than reshuffling on every load. The real version needs a
 * document store, which is a Dan conversation because it holds student PII.
 */

// ---------------------------------------------------------------- statuses

/** Daniel's four colours, plus a neutral for requirements that do not apply to someone. */
export type DocStatus =
  | "not_started"
  | "in_progress"
  | "approved"
  | "needs_update"
  | "not_required";

/** Clicking a document walks this loop. */
export const STATUS_ORDER: DocStatus[] = [
  "not_started",
  "in_progress",
  "approved",
  "needs_update",
  "not_required",
];

export const STATUS_LABEL: Record<DocStatus, string> = {
  not_started: "Nothing yet",
  in_progress: "In progress",
  approved: "Good to go",
  needs_update: "Needs renewal",
  not_required: "Not needed",
};

export const STATUS_LEGEND: Record<DocStatus, string> = {
  not_started: "Red — nothing received yet",
  in_progress: "Yellow — received, being checked",
  approved: "Green — approved, nothing more needed",
  needs_update: "Orange — expiring or out of date",
  not_required: "Grey — does not apply to this applicant",
};

// ---------------------------------------------------------------- the list

export type DocumentDef = {
  doc_id: string;
  name: string;
  /** Goes stale and has to be re-sent — this is what turns something orange. */
  expires?: boolean;
  /** Set when the requirement only applies to some applicants. */
  only_if?: string;
};

const SIGNED_APPLICATION: DocumentDef = {
  doc_id: "signed_application",
  name: "Signed application form",
};

const DIPLOMA: DocumentDef = {
  doc_id: "diploma",
  name: "Copy of diploma",
};

const LICENSE: DocumentDef = {
  doc_id: "license",
  name: "Current, unexpired state or provincial licence",
  expires: true,
};

const REFERENCE_LETTERS: DocumentDef = {
  doc_id: "reference_letters",
  name: "Two character reference letters",
  only_if: "From non-family members. If self-employed, one must describe the practice.",
};

const PHOTOS: DocumentDef = {
  doc_id: "photos",
  name: "Two passport-size photos",
};

const NON_VET_WAIVER: DocumentDef = {
  doc_id: "non_vet_waiver",
  name: "Waiver for Non-Veterinary Licensed Professionals",
  only_if: "Only for applicants who are not licensed veterinarians. Signed and initialled throughout.",
};

const STUDENT_WAIVER: DocumentDef = {
  doc_id: "student_waiver",
  name: "Final-semester student waiver",
  only_if: "Only for applicants still enrolled in college, in their last semester or trimester.",
};

const INTERNATIONAL_CREDENTIALS: DocumentDef = {
  doc_id: "international_credentials",
  name: "Diploma and government licensure for country of practice",
  expires: true,
  only_if: "Only for applicants registering from outside North America.",
};

/** The list genuinely differs by programme, so each one carries its own. */
export const PROGRAM_DOCUMENTS: Record<ProgramKey, DocumentDef[]> = {
  vsmt: [
    SIGNED_APPLICATION,
    DIPLOMA,
    LICENSE,
    REFERENCE_LETTERS,
    PHOTOS,
    NON_VET_WAIVER,
    STUDENT_WAIVER,
    INTERNATIONAL_CREDENTIALS,
  ],
  vmrt: [
    SIGNED_APPLICATION,
    DIPLOMA,
    LICENSE,
    REFERENCE_LETTERS,
    PHOTOS,
    NON_VET_WAIVER,
    STUDENT_WAIVER,
    {
      doc_id: "unlicensed_profession_statement",
      name: "Written statement where the profession is not licensed",
      only_if:
        "Only where the applicant's state or province does not require licensure for their profession.",
    },
    INTERNATIONAL_CREDENTIALS,
  ],
  acupuncture: [
    SIGNED_APPLICATION,
    { doc_id: "diploma", name: "Copy of diploma, or a government letter" },
    LICENSE,
    PHOTOS,
    NON_VET_WAIVER,
    {
      doc_id: "nbce_acupuncture_score",
      name: "Passing NBCE acupuncture exam score",
      only_if: "Only for chiropractor (DC) applicants.",
    },
  ],
  cranio: [
    SIGNED_APPLICATION,
    {
      doc_id: "prior_program_certificate",
      name: "Certificate of attendance from a VSMT or rehabilitation program",
      only_if: "Required of everyone — the seminar builds on a completed postgraduate program.",
    },
    {
      doc_id: "license",
      name: "Current, unexpired licence, registration, or state permit",
      expires: true,
    },
    {
      doc_id: "good_standing_attestation",
      name: "Signed attestation of good standing with the licensing board",
    },
  ],
};

export function documents_for_program(program: ProgramKey): DocumentDef[] {
  return PROGRAM_DOCUMENTS[program];
}

// ---------------------------------------------------------------- pretend statuses

export type UploadedFile = {
  file_name: string;
  size: number;
  uploaded_at: string;
};

export type DocumentState = {
  status: DocStatus;
  updated_on: string | null;
  note: string | null;
  /** Present once someone has actually sent the document in. */
  file?: UploadedFile;
  /** True when this came from a real upload or a real status change, not the pretend generator. */
  real?: boolean;
};

/** What `lib/uploads.ts` keeps on disk. Kept plain so the client can be handed it. */
export type StoredDocRecord = {
  status: DocStatus;
  updated_on: string;
  file?: { file_name: string; size: number; uploaded_at: string };
};

export const STATUS_NOTE: Record<DocStatus, string | null> = {
  not_started: "We have nothing yet",
  in_progress: "Received, being checked by the office",
  approved: null,
  needs_update: "Expiring soon — please send a current copy",
  not_required: null,
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

function pick(seed: number, standing: PaymentStanding, doc: DocumentDef): DocStatus {
  const roll = seed % 100;

  // Conditional requirements genuinely do not apply to most applicants — most people on
  // these programmes are licensed vets practising in North America and not still at
  // college. Anything marked "required of everyone" stays in the count.
  if (doc.only_if && !doc.only_if.startsWith("Required of everyone") && roll < 55) {
    return "not_required";
  }

  // People further along in paying tend to be further along on paperwork, which makes
  // the demo read the way the real thing would.
  const approved_ceiling =
    standing === "paid_in_full"
      ? 78
      : standing === "partly_paid"
        ? 56
        : standing === "deposit_only"
          ? 34
          : 20;

  if (roll < approved_ceiling) {
    if (doc.expires && roll % 7 === 0) return "needs_update";
    return "approved";
  }
  if (roll < approved_ceiling + 20) return "in_progress";
  if (doc.expires && roll % 5 === 0) return "needs_update";
  return "not_started";
}

function fake_date(seed: number): string {
  const days = seed % 240;
  const d = new Date(Date.UTC(2026, 7, 12) - days * 86400000);
  return d.toISOString().slice(0, 10);
}

export function documents_for(
  student_id: string,
  program: ProgramKey,
  standing: PaymentStanding
): Record<string, DocumentState> {
  const out: Record<string, DocumentState> = {};

  for (const doc of documents_for_program(program)) {
    const seed = hash(student_id + ":" + doc.doc_id);
    const status = pick(seed, standing, doc);
    out[doc.doc_id] = {
      status,
      updated_on:
        status === "not_started" || status === "not_required" ? null : fake_date(seed),
      note: STATUS_NOTE[status],
    };
  }

  return out;
}

/**
 * Anything really sent in or really actioned wins over the invented status. So the more
 * Daniel and the office actually use this, the less of it is pretend.
 */
export function merge_documents(
  student_id: string,
  program: ProgramKey,
  standing: PaymentStanding,
  stored: Record<string, StoredDocRecord> | undefined
): Record<string, DocumentState> {
  const generated = documents_for(student_id, program, standing);
  if (!stored) return generated;

  const merged: Record<string, DocumentState> = { ...generated };

  for (const doc of documents_for_program(program)) {
    const record = stored[doc.doc_id];
    if (!record) continue;
    merged[doc.doc_id] = {
      status: record.status,
      updated_on: record.updated_on,
      note: record.file ? null : STATUS_NOTE[record.status],
      ...(record.file ? { file: record.file } : {}),
      real: true,
    };
  }

  return merged;
}

export type StatusCounts = Record<DocStatus, number> & { required: number };

export function count_statuses(
  program: ProgramKey,
  docs: Record<string, DocumentState>
): StatusCounts {
  const counts: StatusCounts = {
    not_started: 0,
    in_progress: 0,
    approved: 0,
    needs_update: 0,
    not_required: 0,
    required: 0,
  };

  for (const doc of documents_for_program(program)) {
    const state = docs[doc.doc_id];
    if (!state) continue;
    counts[state.status] += 1;
    if (state.status !== "not_required") counts.required += 1;
  }

  return counts;
}
