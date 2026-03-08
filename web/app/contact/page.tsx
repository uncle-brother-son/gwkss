import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";
import { getContactPage, getSiteSettings } from "@/lib/queries";

// Revalidate every 24 hours - contact info changes rarely
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
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
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      title: page?.title,
      description: page?.metaDescription || '',
      url: `${baseUrl}/contact`,
      siteName: settings?.companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.title || "Contact Us",
      description: page?.metaDescription || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function ContactPage() {
  const page = await getContactPage();
  const settings = await getSiteSettings();

  return (
    <>
      {page?.image && (
        <BackgroundImage
          desktop={urlFor(page.image).width(1600).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(800).url() : undefined}
          alt={page.title}
        />
      )}
      <div className="col-start-1 col-span-full grid_ my-xl gap-y-12">
        {page?.title && (
          <TransitionBlock
            className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 font-serif text-xl-m lg:text-xl"
            delay={0.24}
          >
            <h1 className="">{page?.title}</h1>
          </TransitionBlock>
        )}
        
        <TransitionBlock
          className="col-start-1 col-span-4 lg:col-start-6 lg:col-span-4 flex flex-col gap-y-4 lg:gap-y-10 mt-2"
          delay={0.48}
        >
          <div className="space-y-2">
            {page?.name && (
                <h2>{page.name}</h2>
            )}
            {page?.address && (
              <div className="rich">
                <PortableText value={page.address} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
          </div>
        </TransitionBlock>
      </div>
    </>
  );
}
