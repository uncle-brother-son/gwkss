import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

async function getContactPage() {
  const query = `*[_type == "contact"][0]{
    title,
    name,
    address,
    metaDescription
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{page?.title || "Contact Us"}</h1>
      
      {page?.name && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{page.name}</h2>
        </div>
      )}
      
      {page?.address && (
        <div className="prose max-w-none">
          <PortableText value={page.address} />
        </div>
      )}
      
      {!page && (
        <div className="text-gray-700">
          <p className="mb-4">
            Get in touch with us for your structural and civil engineering needs.
          </p>
        </div>
      )}
    </div>
  );
}
