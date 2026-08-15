/**
 * Photographs of real classes, copied in from Daniel's Mac
 * (`~/Documents/Claude/Photos:videos`) because the store has no images on its programs,
 * seminars or conference.
 *
 * They live in `public/photos/`, which `.gitignore` excludes — **this repo is public**
 * and these show identifiable students, staff and clients. They work on this machine and
 * go no further.
 *
 * The proper home for them is the products themselves in Shopify. Once they are uploaded
 * there, the store's own images take priority and this map can be deleted.
 */

/** The photograph on the shelf card. */
const PHOTOS: Record<string, string> = {
  // Programme keys
  vsmt: "/photos/vsmt.jpg",
  vmrt: "/photos/vmrt.jpg",
  acupuncture: "/photos/acupuncture.jpg",

  // Product handles
  "2026-conference-attendee-registration": "/photos/conference.jpg",
  "cranio-sacral-2026": "/photos/cranio-sacral.jpg",
  "applied-kinesiology-2026": "/photos/applied-kinesiology.jpg",
};

/**
 * A different photograph for the page the card opens. Seeing the same picture twice in
 * two clicks makes a site feel thin; a second view of the same work makes it feel like
 * there is more behind it.
 */
const HEROES: Record<string, string> = {
  vsmt: "/photos/vsmt-hero.jpg",
  vmrt: "/photos/vmrt-hero.jpg",
  acupuncture: "/photos/acupuncture-hero.jpg",

  "2026-conference-attendee-registration": "/photos/conference-hero.jpg",
  "cranio-sacral-2026": "/photos/cranio-sacral-hero.jpg",
  "applied-kinesiology-2026": "/photos/applied-kinesiology-hero.jpg",
};

const CAPTIONS: Record<string, string> = {
  vsmt: "A VSMT class adjusting a dog in the arena",
  vmrt: "A practitioner assessing a dog on the VMRT program",
  acupuncture: "Needles placed along a dog during an acupuncture session",
  "2026-conference-attendee-registration": "A presentation at the Healing Oasis homecoming conference",
  "cranio-sacral-2026": "Gentle cranio-sacral work on a patient",
  "applied-kinesiology-2026": "Applied kinesiology assessment during a seminar",
};

export function local_photo(key: string): string | null {
  return PHOTOS[key] ?? null;
}

/** Falls back to the card photograph rather than showing nothing. */
export function local_hero(key: string): string | null {
  return HEROES[key] ?? PHOTOS[key] ?? null;
}

export function local_photo_alt(key: string, fallback: string): string {
  return CAPTIONS[key] ?? fallback;
}
