import { fileURLToPath } from "node:url";

const REVIEW = process.env.PORTAL_DEMO === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The review build compiles differently — invented students, plain links, a banner that
  // says so — so it is kept in its own folder. Building the review link must never leave
  // the app Daniel runs here sitting on that build.
  distDir: REVIEW ? ".next-review" : ".next",

  // The review build is one self-contained file with no address of its own, so Next's
  // Link — which prefetches by resolving each target against the current page — throws
  // on every link and takes the app down. Only there, links become plain anchors.
  webpack: (config) => {
    if (REVIEW) {
      config.resolve.alias["next/link"] = fileURLToPath(
        new URL("./app/review/plain-link.tsx", import.meta.url)
      );
    }
    return config;
  },
  // Real student names and orders come from Shopify at request time and are never
  // written to disk. Nothing here is cached to the filesystem.
  experimental: { isrFlushToDisk: false },
};

export default nextConfig;
