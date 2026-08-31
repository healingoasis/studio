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
    waiting_for: "Your diploma file, so the layout can be matched exactly.",
  },
];

export function admin_doc(doc_id: string): AdminDocDef | null {
  return ADMIN_DOCS.find((d) => d.doc_id === doc_id) ?? null;
}

/**
 * Measured from `NAME ID for the Table.pdf`: one landscape page, 792 x 612 pt, Bookman
 * Old Style, everything centred on the page at x = 396 with the logo to the left.
 *
 * The card is drawn as SVG in the page's own coordinates, which is the one way to place
 * a line of type by its baseline rather than by guessing where a given font puts it. A
 * machine with Bookman Old Style installed and one falling back to Georgia then put the
 * text in exactly the same place; only the letterforms differ.
 *
 * `baseline` is measured down from the top of the page, converted from the PDF's own
 * bottom-up coordinates.
 */
export const NAME_TAG = {
  page_width: 792,
  page_height: 612,
  /** Everything is centred on the page, not on the space beside the logo. */
  centre_x: 396,
  first: { size: 72.024, baseline: 327.05 },
  last: { size: 36, baseline: 377.59 },
  state: { size: 12, baseline: 397.15 },
  logo: { x: 76.9, y: 281.9, width: 124.6, height: 144.6 },
  /** The original paints a white block behind the logo; keep it so the ink matches. */
  logo_backing: { x: 69.75, y: 278.25, width: 139, height: 151.8 },
  font_stack:
    '"Bookman Old Style", Bookman, "URW Bookman L", "Century Schoolbook", ' +
    '"New Century Schoolbook", Georgia, serif',
} as const;
