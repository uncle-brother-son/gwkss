import { client } from "@/lib/sanity";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

interface PageData {
  title: string;
  slug: { current: string } | null;
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

async function getPageData(slug: string): Promise<PageData | null> {
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      slug,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    getPageData(slug),
    getSiteSettings(),
  ]);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const title = settings?.companyName 
    ? `${page.title} | ${settings.companyName}`
    : page.title;
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
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
