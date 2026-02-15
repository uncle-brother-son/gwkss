import Navigation from "./Navigation";
import { getPages, getSiteSettings } from "@/lib/sanity/queries";

async function getNavigationData() {
  const [pages, settings] = await Promise.all([
    getPages(),
    getSiteSettings()
  ]);
  
  return {
    pages: pages || [],
    companyName: settings?.companyName || "GWK Structural Solutions Ltd"
  };
}

export default async function ServerNavigation() {
  const { pages, companyName } = await getNavigationData();
  return <Navigation pages={pages} companyName={companyName} />;
}
