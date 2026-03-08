import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";

async function getContactPage() {
  const query = `*[_type == "contact"][0]{
    title,
    name,
    address,
    image,
    mobileImage,
    metaDescription
  }`;
  
  return client.fetch(query);
}

async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{
    email,
    phone
  }`;
  
  return client.fetch(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  
  return {
    title: page?.title || "Contact Us",
    description: page?.metaDescription || "Get in touch with GWK Structural Solutions",
  };
}

export default async function ContactPage() {
  const page = await getContactPage();
  const settings = await getSiteSettings();

  return (
    <>
      {page?.image && (
        <BackgroundImage
          desktop={urlFor(page.image).width(1920).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(1920).url() : undefined}
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
