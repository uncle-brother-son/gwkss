import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";
import { getAboutPage, getSiteSettings } from "@/lib/queries";

// On-demand revalidation via Sanity webhook
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  const baseUrl = 'https://gwkss.co.uk';
  
  // Fetch OG image and company name from site settings
  const settings = await getSiteSettings();
  
  const ogImageUrl = settings?.ogImage 
    ? urlFor(settings.ogImage).width(1200).height(630).url()
    : undefined;
  
  return {
    title: page?.title,
    description: page?.metaDescription || '',
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title: page?.title,
      description: page?.metaDescription || '',
      url: `${baseUrl}/about`,
      siteName: settings?.companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.title || "About Us",
      description: page?.metaDescription || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <>
      {page?.image && (
        <BackgroundImage
          desktop={urlFor(page.image).width(1600).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(800).url() : undefined}
          alt={page.title}
        />
      )}
      <div className="col-start-1 col-span-full grid_ my-xl gap-y-10">
        {page?.title && (
          <TransitionBlock
            className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 font-serif text-xl-m lg:text-xl"
            delay={0.24}
          >
            <h1 className="">{page?.title}</h1>
          </TransitionBlock>
        )}
        
        {page?.content && (
          <TransitionBlock
            className="col-start-1 col-span-4 lg:col-start-6 lg:col-span-4 richer mt-2"
            delay={0.48}
          >
            <PortableText value={page.content} />
          </TransitionBlock>
        )}
      </div>
    </>
  );
}
