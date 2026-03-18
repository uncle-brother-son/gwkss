import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import BackgroundImage from "../../components/BackgroundImage";
import TransitionBlock from "../../components/TransitionBlock";
import Accordion from "../../components/Accordion";
import { getServiceBySlug, getSiteSettings, getServices } from "@/lib/queries";

// On-demand revalidation via Sanity webhook
export const revalidate = false;

// Pre-render all service pages at build time
export async function generateStaticParams() {
  const services = await getServices();
  
  return services.map((service: { slug: string }) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const baseUrl = 'https://gwkss.co.uk';
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }
  
  // Fetch OG image from site settings
  const settings = await getSiteSettings();
  const ogImageUrl = settings?.ogImage 
    ? urlFor(settings.ogImage).width(1200).height(630).url()
    : undefined;
  
  return {
    title: service.title,
    description: service.metaDescription || "",
    alternates: {
      canonical: `${baseUrl}/engineering-services/${slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.metaDescription || "",
      url: `${baseUrl}/engineering-services/${slug}`,
      siteName: settings?.companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.metaDescription || "",
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Fetch company name for structured data
  const settings = await getSiteSettings();
  const companyName = settings?.companyName || '';

  // Breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://gwkss.co.uk'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Engineering Services',
        'item': 'https://gwkss.co.uk/engineering-services'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': service.title,
        'item': `https://gwkss.co.uk/engineering-services/${slug}`
      }
    ]
  };

  // Service structured data
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.title,
    'description': service.metaDescription || '',
    'provider': {
      '@type': 'ProfessionalService',
      'name': companyName,
      'url': 'https://gwkss.co.uk'
    },
    'areaServed': {
      '@type': 'Country',
      'name': 'United Kingdom'
    }
  };

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      {service?.image && (
        <BackgroundImage
          desktop={urlFor(service.image).width(1600).url()}
          mobile={service?.mobileImage ? urlFor(service.mobileImage).width(800).url() : undefined}
          alt={service.title}
        />
      )}
      <div className="col-start-1 col-span-full grid_ my-xl gap-y-10">
        {service?.title && (
          <TransitionBlock
            className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 font-serif text-xl-m lg:text-xl"
            delay={0.24}
          >
            <h1 className="">{service?.title}</h1>
          </TransitionBlock>
        )}

        <TransitionBlock
          className="col-start-1 col-span-4 lg:col-start-6 lg:col-span-4 mt-2"
          delay={0.48}
        >
          {service.content && (
            <div className="rich">
              <PortableText value={service.content} />
            </div>
          )}
        
          {service.accordionSections && service.accordionSections.length > 0 && (
            <Accordion sections={service.accordionSections} />
          )}
        </TransitionBlock>
      </div>
    </>
  );
}
