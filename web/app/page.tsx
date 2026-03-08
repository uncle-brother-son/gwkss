import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "./components/BackgroundImage";
import TransitionBlock from "./components/TransitionBlock";

async function getHomePage() {
  const query = `*[_type == "home"][0]{
    title,
    content,
    image,
    mobileImage,
    metaDescription
  }`;
  
  return client.fetch(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  
  return {
    title: page?.title || "GWK Structural Solutions Ltd",
    description: page?.metaDescription || "Structural and Civil Engineering services for all sectors of the construction industry and property market",
  };
}

export default async function HomePage() {
  const page = await getHomePage();

  return (
    <>
      {page?.image && (
        <BackgroundImage
          desktop={urlFor(page.image).width(1920).url()}
          mobile={page?.mobileImage ? urlFor(page.mobileImage).width(1920).url() : undefined}
          alt={page.title}
        />
      )}
      <div className="col-start-1 col-span-full grid_ my-xl">
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
