import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false, // Disable CDN for instant updates (30s ISR handles caching)
  perspective: 'published', // Only show published content
  fetch: { cache: 'no-store' }, // Always fetch fresh from Sanity, never use Next.js build-time fetch cache
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder
    .image(source)
    .auto('format')  // Auto WebP/AVIF when browser supports it
    .quality(85);    // Optimal balance between quality and file size
}
