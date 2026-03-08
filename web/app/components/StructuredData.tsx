import Script from 'next/script';
import { getSiteSettings, getHomePageDescription } from '@/lib/queries';

export default async function StructuredData() {
  const settings = await getSiteSettings();
  const homePage = await getHomePageDescription();
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://gwkss.co.uk/#organization',
    name: settings?.companyName || '',
    url: 'https://gwkss.co.uk',
    logo: 'https://gwkss.co.uk/GWK-Structural-Solutions-Logo.png',
    description: homePage?.metaDescription || '',
    email: settings?.email,
    telephone: settings?.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    priceRange: '$$',
    sameAs: [
      // Add social media URLs here when available
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  );
}
