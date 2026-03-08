import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackgroundImage from "../../components/BackgroundImage";
import TransitionBlock from "../../components/TransitionBlock";
import Accordion from "../../components/Accordion";

async function getService(slug: string) {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    content,
    accordionSections,
    image,
    mobileImage,
    metaDescription
  }`;
  
  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }
  
  return {
    title: service.title,
    description: service.metaDescription || "",
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {service?.image && (
        <BackgroundImage
          desktop={urlFor(service.image).width(1920).url()}
          mobile={service?.mobileImage ? urlFor(service.mobileImage).width(1920).url() : undefined}
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
