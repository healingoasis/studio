import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The review build is one self-contained file with no address of its own, so Next's
  // Link — which prefetches by resolving each target against the current page — throws
  // on every link and takes the app down. Only there, links become plain anchors.
  webpack: (config) => {
    if (process.env.PORTAL_DEMO === "1") {
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
