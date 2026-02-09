import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GWK Structural Solutions Ltd",
  description: "Structural and Civil Engineering services for all sectors of the construction industry and property market",
};

async function getPages() {
  return client.fetch(
    `*[_type == "page"] | order(_createdAt asc) {
      title,
      "slug": slug.current
    }`
  );
}

async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    companyName
  }`);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pages, settings] = await Promise.all([
    getPages(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <Navigation pages={pages} companyName={settings?.companyName || "GWK Structural Solutions Ltd"} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
