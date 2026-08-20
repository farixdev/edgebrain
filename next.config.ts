import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Images: nothing to configure.
   *
   * Every `next/image` src on this site is a local path under /public
   * (uploads land in public/images/projects via the admin upload route), so
   * the default loader handles them and no `remotePatterns` entry is needed.
   * If images ever move to a CDN or an external CMS, add that host to
   * `images.remotePatterns` — Next refuses to optimise unlisted hosts.
   */
};

export default nextConfig;
