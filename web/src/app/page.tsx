import { getHomePage, getSiteSettings } from "@/lib/sanity/queries";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getHomePage(),
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
  const page = await getHomePage();

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
