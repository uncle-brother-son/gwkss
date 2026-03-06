import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import type { Metadata } from "next";

async function getServicesPage() {
  const query = `*[_type == "servicesPage"][0]{
    title,
    content,
    menu[]->{
      _id,
      title,
      "slug": slug.current
    },
    metaDescription
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{page?.title || "Our Services"}</h1>
      
      {page?.content && (
        <div className="prose max-w-none mb-12">
          <PortableText value={page.content} />
        </div>
      )}
      
      {displayServices.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {displayServices.map((service: any) => (
            <Link 
              key={service._id}
              href={`/engineering-services/${service.slug}`}
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              {service.content && service.content[0] && (
                <p className="text-gray-700">
                  {service.content[0].children?.[0]?.text || ''}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">
          <p>No services available yet.</p>
        </div>
      )}
    </div>
  );
}
