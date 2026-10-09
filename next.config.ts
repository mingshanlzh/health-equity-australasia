import type { NextConfig } from "next";

// Served from the root of https://healthequityaustralasia.org (custom domain
// on GitHub Pages). To build for a sub-path instead, for example the old
// mingshanlzh.github.io/health-equity-australasia address, set
// NEXT_PUBLIC_BASE_PATH="/health-equity-australasia" at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
