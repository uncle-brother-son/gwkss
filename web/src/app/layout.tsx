import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServerNavigation from "@/components/ServerNavigation";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <ServerNavigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
