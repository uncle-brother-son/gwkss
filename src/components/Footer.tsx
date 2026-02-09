import { client } from "@/lib/sanity";

async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    companyName,
    email,
    phone
  }`);
}

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-auto">
      <div className="mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="text-sm">
            <p>Email: <a href={`mailto:${settings?.email}`}>{settings?.email}</a></p>
            <p>Mobile: <a href={`tel:${settings?.phone?.replace(/\s/g, '')}`}>{settings?.phone}</a></p>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} {settings?.companyName}
          </div>
        </div>
      </div>
    </footer>
  );
}
