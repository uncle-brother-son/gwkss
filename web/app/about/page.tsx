import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import BackgroundImage from "../components/BackgroundImage";
import TransitionBlock from "../components/TransitionBlock";

async function getAboutPage() {
  const query = `*[_type == "about"][0]{
    title,
    content,
    image,
    mobileImage,
    metaDescription
  }`;
  
  return client.fetch(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  
  return {
    title: page?.title || "About Us",
    description: page?.metaDescription || "Learn more about GWK Structural Solutions",
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();

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
