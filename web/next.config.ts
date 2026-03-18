import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    unoptimized: true, // Cloudflare doesn't support Next.js Image Optimization API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Prevent Cloudflare edge from caching HTML pages
        // Let KV cache handle page caching via on-demand revalidation
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
      {
        // Static assets can be cached forever
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
