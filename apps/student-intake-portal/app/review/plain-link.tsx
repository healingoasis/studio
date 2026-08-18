import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * What `next/link` becomes in the review build.
 *
 * The real Link prefetches the page behind it as soon as it is on screen, and works out
 * where that is by resolving the address against the page's own. The review copy has no
 * address it can resolve against, so every link on the page throws and takes the app
 * down with it. A plain anchor has nothing to prefetch. Clicks on these are caught in
 * `review-shell.tsx` and answered there, so nothing tries to navigate either.
 *
 * Swapped in by `next.config.mjs`, only when PORTAL_DEMO is set.
 */
export default function PlainLink({
  href,
  children,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  ...rest
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}) {
  const to = typeof href === "string" ? href : href.pathname ?? "#";
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
}
