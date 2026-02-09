import { client } from "@/lib/sanity";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";

interface PageData {
  title: string;
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

async function getHomeData(): Promise<PageData | null> {
  return client.fetch(
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

async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    companyName,
    ogImage {
      asset-> {
        url
      }
    }
  }`);
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getHomeData(),
    getSiteSettings(),
  ]);

  if (!page) {
    return {
      title: settings?.companyName || "GWKSS Structural Engineers",
    };
  }

  const title = settings?.companyName || "GWKSS Structural Engineers";
  const description = page.metaDescription;
  const ogImage = settings?.ogImage?.asset?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function HomePage() {
  const page = await getHomeData();

  if (!page) {
    return <div>No homepage found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto">
        <h1 className="text-5xl mb-8">{page.title}</h1>
        {page.image?.asset && (
          <div className="mb-8">
            <Image
              src={page.image.asset.url}
              alt={page.image.alt || page.title}
              width={page.image.asset.metadata.dimensions.width}
              height={page.image.asset.metadata.dimensions.height}
              className="rounded-lg w-full h-auto"
            />
          </div>
        )}
        <div className="page-content max-w-none">
          <PortableText value={page.content} />
        </div>
      </div>
    </div>
  );
}
