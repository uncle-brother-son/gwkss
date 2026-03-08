import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "./components/BackgroundImage";
import TransitionBlock from "./components/TransitionBlock";
import { getHomePage, getSiteSettings } from "@/lib/queries";

// Revalidate every hour - homepage content changes occasionally
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const baseUrl = 'https://gwkss.co.uk';
  
  // Fetch OG image and company name from site settings
  const settings = await getSiteSettings();
  const companyName = settings?.companyName || '';
  const defaultDescription = page?.metaDescription || '';
  
  const ogImageUrl = settings?.ogImage 
    ? urlFor(settings.ogImage).width(1200).height(630).url()
    : undefined;
  
  return {
    // Homepage uses default title from layout (no suffix needed)
    description: defaultDescription,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: page?.title || companyName,
      description: defaultDescription,
      url: baseUrl,
      siteName: companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.title || companyName,
      description: defaultDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function HomePage() {
  const page = await getHomePage();

  return (
    <>
      {page?.image && (
        <BackgroundImage
          desktop={urlFor(page.image).width(1600).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(800).url() : undefined}
          alt={page.title}
        />
      )}
      <div className="col-start-1 col-span-full grid_ my-xl">
        {page?.title && <h1 className="sr-only">{page.title}</h1>}
        {page?.content && (
          <TransitionBlock
            className="col-start-1 col-span-4 lg:col-start-4 lg:col-span-6 font-serif text-lg-m lg:text-lg"
            delay={0.24}
          >
            <PortableText value={page.content} />
          </TransitionBlock>
        )}
      </div>
    </>
  );
}
