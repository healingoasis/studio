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

const CAPTIONS: Record<string, string> = {
  vsmt: "Students adjusting a horse during a VSMT module",
  vmrt: "Rehabilitation work with a dog on the VMRT program",
  acupuncture: "A patient during a veterinary acupuncture session",
  "2026-conference-attendee-registration": "The Healing Oasis homecoming conference",
  "cranio-sacral-2026": "Hands-on technique work during a seminar",
  "applied-kinesiology-2026": "Students assessing a patient together",
};

export function local_photo(key: string): string | null {
  return PHOTOS[key] ?? null;
}

export function local_photo_alt(key: string, fallback: string): string {
  return CAPTIONS[key] ?? fallback;
}
