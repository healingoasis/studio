"use client";

import { createContext, useContext } from "react";
import Link from "next/link";

/**
 * The shareable review copy is one page holding both versions, so there is nowhere to
 * navigate to. When it is in charge it puts a swap function here, and the switch drives
 * that instead of the router. Empty everywhere else, where the links are real.
 */
export const ReviewSwap = createContext<((href: "/" | "/record") => void) | null>(null);

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
  const swap = useContext(ReviewSwap);

  return (
    <div className="segmented version-switch" role="group" aria-label="Choose a version">
      {VERSIONS.map((v) =>
        v.href === current ? (
          <span key={v.href} aria-current="page" className="version-on">
            {v.label}
          </span>
        ) : swap ? (
          <button key={v.href} type="button" onClick={() => swap(v.href)}>
            {v.label}
          </button>
        ) : (
          <Link key={v.href} href={v.href}>
            {v.label}
          </Link>
        )
      )}
    </div>
  );
}
