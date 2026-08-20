import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Images: nothing to configure.
   *
   * Every `next/image` src on this site is either a local path under /public
   * or a base64 `data:` URI — project thumbnails uploaded from the admin panel
   * are stored inline in the content document, because /public is baked at
   * build time and Vercel's runtime filesystem is read-only. The default
   * loader handles local paths, and `next/image` serves a `data:` src
   * unoptimised by design, so no `remotePatterns` entry is needed either way.
   * If images ever move to a CDN or an external CMS, add that host to
   * `images.remotePatterns` — Next refuses to optimise unlisted hosts.
   */
};

export default nextConfig;
