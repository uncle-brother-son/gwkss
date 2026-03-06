import type { Metadata } from "next";
import Script from "next/script";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const roboto = Roboto({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-roboto", display: "swap" });
const robotoSlab = Roboto_Slab({ weight: ["400"], subsets: ["latin"], variable: "--font-roboto-slab", display: "swap" });

export const metadata: Metadata = {
  title: "GWK Structural Solutions Ltd",
  description: "Structural and Civil Engineering services for all sectors of the construction industry and property market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoSlab.variable}`}>
      <body className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans text-md subpixel-antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EM23GJ3ZG8" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EM23GJ3ZG8');
          `}
        </Script>
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
