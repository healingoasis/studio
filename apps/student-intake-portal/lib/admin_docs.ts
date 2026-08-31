/**
 * The office paperwork that gets printed for a class, as opposed to the paperwork a
 * student sends in. These are Daniel's own documents — the school's forms, not invented
 * ones — so each is either measured from the file he supplied or is a slot waiting for it.
 */

export type AdminDocDef = {
  doc_id: string;
  name: string;
  /** What it is, in the office's words. */
  what: string;
  /** What the portal fills in, so it is obvious why the class list has to be right. */
  fills: string;
  /** Built from a file Daniel has already supplied. */
  ready: boolean;
  /** One page per student, rather than one page for the class. */
  per_student: boolean;
  /** Set when the layout came from a file Daniel sent, so it can be credited. */
  source_file?: string;
  /** Shown on a slot that is still waiting. */
  waiting_for?: string;
};

export const ADMIN_DOCS: AdminDocDef[] = [
  {
    doc_id: "name_tags",
    name: "Desk name tags",
    what:
      "The folded card that sits on the table in front of each student. Same format for every program and every CE seminar.",
    fills: "First name, last name, degree and state for everyone in the class.",
    ready: true,
    per_student: true,
    source_file: "NAME ID for the Table.pdf",
  },
  {
    doc_id: "diploma",
    name: "Diploma",
    what: "The certificate awarded at the end of the program.",
    fills: "Student name and the program they completed.",
    ready: false,
    per_student: true,
    waiting_for: "Daniel's diploma file, so the layout can be matched exactly.",
  },
];

export function admin_doc(doc_id: string): AdminDocDef | null {
  return ADMIN_DOCS.find((d) => d.doc_id === doc_id) ?? null;
}

/**
 * Measured from `NAME ID for the Table.pdf`: one landscape page, 792 x 612 pt, Bookman
 * Old Style, everything centred on the page at x = 396 with the logo to the left.
 * Baselines are given from the top of the page, converted from the PDF's own coordinates.
 */
export const NAME_TAG = {
  page_width_pt: 792,
  page_height_pt: 612,
  /** Ascent as a share of the font size, used to place a baseline from a CSS `top`. */
  ascent_ratio: 0.73,
  first: { size_pt: 72.024, baseline_pt: 327.05 },
  last: { size_pt: 36, baseline_pt: 377.59 },
  state: { size_pt: 12, baseline_pt: 397.15 },
  logo: { left_pt: 76.9, top_pt: 281.9, width_pt: 124.6, height_pt: 144.6 },
} as const;

/** Where a line's box has to start for its baseline to land where the PDF puts it. */
export function line_top_pt(line: { size_pt: number; baseline_pt: number }): number {
  return line.baseline_pt - line.size_pt * NAME_TAG.ascent_ratio;
}
