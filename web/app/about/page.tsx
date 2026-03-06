import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

async function getAboutPage() {
  const query = `*[_type == "about"][0]{
    title,
    content,
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
    <div className="grid_ my-xl">

      {page?.title && (
        <div className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 font-serif text-xl">
          <h1 className="">{page?.title}</h1>
        </div>
      )}
      
      {page?.content && (
        <div className="col-start-1 col-span-4 lg:col-start-6 lg:col-span-4 rich">
          <PortableText value={page.content} />
        </div>
      )}

    </div>
  );
}
