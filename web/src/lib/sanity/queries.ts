import { client } from "./client";

export interface Page {
  title: string;
  slug?: string;
  content: any[];
  metaDescription?: string;
  image?: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
}

export interface SiteSettings {
  companyName?: string;
  email?: string;
  phone?: string;
  ogImage?: {
    asset: {
      url: string;
    };
  };
}

export async function getPages(): Promise<Page[]> {
  return client.fetch<Page[]>(
    `*[_type == "page"] | order(_createdAt asc) {
      title,
      "slug": slug.current
    }`
  );
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      content,
      metaDescription,
      image {
        asset-> {
          url,
          metadata {
            dimensions
          }
        },
        alt
      }
    }`,
    { slug }
  );
}

export async function getHomePage(): Promise<Page | null> {
  return client.fetch<Page | null>(
    `*[_type == "page" && (!defined(slug.current) || slug.current == "")][0]{
      title,
      content,
      metaDescription,
      image {
        asset-> {
          url,
          metadata {
            dimensions
          }
        },
        alt
      }
    }`
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0]{
      companyName,
      email,
      phone,
      ogImage {
        asset-> {
          url
        }
      }
    }`
  );
}
