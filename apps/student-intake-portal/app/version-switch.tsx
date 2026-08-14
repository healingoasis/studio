"use client";

import Link from "next/link";

/**
 * Two complete versions of the same product, kept side by side until Daniel picks one.
 * Same data, same behaviour, different presentation — so the choice is about how it
 * should feel, not about which one does more.
 */
export const VERSIONS = [
  { href: "/", label: "Portal" },
  { href: "/record", label: "Student file" },
] as const;

export function VersionSwitch({ current }: { current: "/" | "/record" }) {
  return (
    <div className="segmented version-switch" role="group" aria-label="Choose a version">
      {VERSIONS.map((v) =>
        v.href === current ? (
          <span key={v.href} aria-current="page" className="version-on">
            {v.label}
          </span>
        ) : (
          <Link key={v.href} href={v.href}>
            {v.label}
          </Link>
        )
      )}
    </div>
  );
}
