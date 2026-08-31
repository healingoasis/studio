/**
 * Reading and writing a class term — "Fall 2026" to `fall-2026` and back.
 *
 * This is deliberately its own file with no imports. The class page needs it in the
 * browser, and anything that reaches the store or the filesystem cannot go there.
 */

export const SEASONS = ["spring", "summer", "fall", "winter"] as const;

export type Season = (typeof SEASONS)[number];

export function class_slug(term: string): string | null {
  const t = term.toLowerCase();
  const a = /(spring|summer|fall|winter)\s*(20\d\d)/.exec(t);
  const b = /(20\d\d)\s*(spring|summer|fall|winter)/.exec(t);
  const season = a?.[1] ?? b?.[2];
  const year = a?.[2] ?? b?.[1];
  if (!season || !year) return null;
  return `${season}-${year}`;
}

export function class_label(slug: string): string {
  const [season, year] = slug.split("-");
  if (!season || !year) return slug;
  return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year}`;
}

/** Earliest class first, so the folder list reads as a calendar. */
export function class_sort(slug: string): number {
  const [season, year] = slug.split("-");
  const index = SEASONS.indexOf(season as Season);
  return Number(year ?? 0) * 10 + (index < 0 ? 0 : index);
}

/** Where a person with no class of their own waits to be placed. */
export const UNPLACED = "unplaced";
