import { cache } from 'react';
import { client } from './sanity';

// Centralized Sanity queries wrapped with React cache for automatic deduplication

export const getSiteSettings = cache(async () => {
  const query = `*[_type == "siteSettings"][0]{
    companyName,
    email,
    phone,
    ogImage,
    mainMenu[]{
      label,
      link,
      submenu[]{
        label,
        link,
        description
      }
    }
  }`;
  return client.fetch(query);
});

export const getHomePageDescription = cache(async () => {
  const query = `*[_type == "home"][0]{
    metaDescription
  }`;
  return client.fetch(query);
});

export const getHomePage = cache(async () => {
  const query = `*[_type == "home"][0]{
    title,
    content,
    image,
    mobileImage,
    metaDescription
  }`;
  return client.fetch(query);
});

export const getAboutPage = cache(async () => {
  const query = `*[_type == "about"][0]{
    title,
    content,
    image,
    mobileImage,
    metaDescription
  }`;
  return client.fetch(query);
});

export const getContactPage = cache(async () => {
  const query = `*[_type == "contact"][0]{
    title,
    name,
    address,
    image,
    mobileImage,
    metaDescription
  }`;
  return client.fetch(query);
});

export const getServicesPage = cache(async () => {
  const query = `*[_type == "servicesPage"][0]{
    title,
    content,
    menu[]->{
      _id,
      title,
      "slug": slug.current
    },
    image,
    mobileImage,
    metaDescription
  }`;
  return client.fetch(query);
});

export const getServices = cache(async () => {
  const query = `*[_type == "service"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    content,
    shortDescription,
    order
  }`;
  return client.fetch(query);
});

export const getServiceBySlug = cache(async (slug: string) => {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    title,
    content,
    accordionSections,
    image,
    mobileImage,
    metaDescription
  }`;
  return client.fetch(query, { slug });
});
