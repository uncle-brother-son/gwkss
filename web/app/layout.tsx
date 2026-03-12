import type { Metadata } from "next";
import Script from "next/script";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";
import { urlFor } from "@/lib/sanity";
import { getSiteSettings, getHomePageDescription } from "@/lib/queries";

const roboto = Roboto({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-roboto", display: "swap" });
const robotoSlab = Roboto_Slab({ weight: ["400"], subsets: ["latin"], variable: "--font-roboto-slab", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const homePage = await getHomePageDescription();
  const baseUrl = 'https://gwkss.co.uk';
  
  const companyName = settings?.companyName || '';
  const defaultDescription = homePage?.metaDescription || '';
  
  const ogImageUrl = settings?.ogImage 
    ? urlFor(settings.ogImage).width(1200).height(630).url()
    : undefined;

  return {
    title: {
      default: companyName,
      template: `%s | ${companyName}`,
    },
    description: defaultDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: companyName,
      description: defaultDescription,
      url: baseUrl,
      siteName: companyName,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: companyName,
      description: defaultDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${roboto.variable} ${robotoSlab.variable}`}>
      <body className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans text-md subpixel-antialiased dark:antialiased transition-colors duration-lg ease-gwk">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EM23GJ3ZG8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EM23GJ3ZG8');
          `}
        </Script>
        <StructuredData />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="grow grid grid-cols-1 items-center">
          {children}
        </main>
        <Footer />
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
