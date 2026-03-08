import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";
import TransitionLink from "../components/TransitionLink";

interface Service {
  _id: string;
  title: string;
  slug: string;
}

async function getServicesPage() {
  const query = `*[_type == "servicesPage"][0]{
    title,
    content,
    menu[]->{
      _id,
      title,
      "slug": slug.current
    },
    image,    mobileImage,    metaDescription
  }`;
  
  return client.fetch(query);
}

async function getServices() {
  const query = `*[_type == "service"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    content
  }`;
  
  return client.fetch(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage();
  
  return {
    title: page?.title || "Our Services",
    description: page?.metaDescription || "Professional structural and civil engineering services",
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
          desktop={urlFor(page.image).width(1920).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(1920).url() : undefined}
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
