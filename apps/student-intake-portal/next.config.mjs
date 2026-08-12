/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Real student names and orders come from Shopify at request time and are never
  // written to disk. Nothing here is cached to the filesystem.
  experimental: { isrFlushToDisk: false },
};

export default nextConfig;
