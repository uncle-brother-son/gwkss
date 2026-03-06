import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

async function getService(slug: string) {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    content,
    accordionSections,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{service.title}</h1>
      {service.content && (
        <div className="prose max-w-none mb-8">
          <PortableText value={service.content} />
        </div>
      )}
      
      {service.accordionSections && service.accordionSections.length > 0 && (
        <div className="space-y-4 mt-12">
          {service.accordionSections.map((section: any, index: number) => (
            <details key={index} className="border border-gray-200 rounded-lg p-4">
              <summary className="font-semibold text-lg cursor-pointer hover:text-gray-700">
                {section.title}
              </summary>
              {section.content && (
                <div className="prose max-w-none mt-4">
                  <PortableText value={section.content} />
                </div>
              )}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
