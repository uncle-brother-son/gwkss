import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

async function getHomePage() {
  const query = `*[_type == "home"][0]{
    title,
    content,
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
    <div className="grid_ my-xl">
      {page?.content && (
        <div className="col-start-1 col-span-4 lg:col-start-4 lg:col-span-6 font-serif text-lg">
          <PortableText value={page.content} />
        </div>
      )}
    </div>
  );
}
