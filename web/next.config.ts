import type { NextConfig } from "next";
import { cloudflare } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
};

export default cloudflare(nextConfig);
