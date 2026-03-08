import { getSiteSettings } from "@/lib/queries";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="grid_ mb-6 gap-y-8">
      <div className="col-start-1 col-span-2 lg:col-start-1 lg:col-span-3 flex justify-start items-start text-sm-x">
        {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
      </div>
      <div className="col-start-3 col-span-2 lg:col-start-6 lg:col-span-3 flex justify-start items-start text-sm-x">
        {settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
      </div>
      <div className="col-start-1 col-span-4 lg:col-start-10 lg:col-span-3 flex justify-start items-start text-sm-x">
        &copy; {new Date().getFullYear()} {settings?.companyName} 
      </div>
    </footer>
  );
}
