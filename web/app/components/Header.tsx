import TransitionLink from "./TransitionLink";
import { client } from "@/lib/sanity";
import Icon from "../components/Icons";
import MainNav from "./MainNav";

async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0]{
    companyName,
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
}

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <nav className="grid_ mt-6">
      <div className="col-start-1 col-span-2 lg:col-start-1 lg:col-span-5 flex">
        <TransitionLink href="/" aria-label={settings?.companyName}>
          <Icon name="logo" className="fill-black dark:fill-white h-14" />
        </TransitionLink>
      </div>
      <MainNav menuItems={settings?.mainMenu || []} companyName={settings?.companyName} />
    </nav>
  );
}
