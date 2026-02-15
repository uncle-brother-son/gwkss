import { getPages, getPageBySlug, getSiteSettings } from "@/lib/sanity/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getPages();
  
  return pages.map((page) => ({
    slug: page.slug || "",
  })).filter(p => p.slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const [page, settings] = await Promise.all([
      getPageBySlug(slug),
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "GWK Structural Solutions Ltd",
    };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

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
