import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";
import TransitionLink from "../components/TransitionLink";
import { getServicesPage, getServices, getSiteSettings } from "@/lib/queries";

// Revalidate every hour - services updated occasionally
export const revalidate = 3600;

interface Service {
  _id: string;
  title: string;
  slug: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage();
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
      canonical: `${baseUrl}/engineering-services`,
    },
    openGraph: {
      title: page?.title,
      description: page?.metaDescription || '',
      url: `${baseUrl}/engineering-services`,
      siteName: settings?.companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.title,
      description: page?.metaDescription || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function ServicesPage() {
  const page = await getServicesPage();
  const services = await getServices();

  // Use menu if defined, otherwise fall back to all services
  const displayServices = page?.menu && page.menu.length > 0 ? page.menu : services;

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

        <TransitionBlock
          className="col-start-1 col-span-4 lg:col-start-6 lg:col-span-4 rich mt-2"
          delay={0.48}
        >
          {page?.content && (
            <div className="rich">
              <PortableText value={page.content} />
            </div>
          )}
          <div className="mt-10 space-y-4">
            {displayServices?.map((service: Service) => (
              <TransitionLink className="block hover:text-purple dark:hover:text-purple" key={service._id} href={`/engineering-services/${service.slug}`}>
                {service.title}
              </TransitionLink>
            ))}
          </div>
        </TransitionBlock>
      </div>
    </>
  );
}
