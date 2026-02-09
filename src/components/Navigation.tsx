"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Page {
  title: string;
  slug?: string;
}

interface NavigationProps {
  pages: Page[];
  companyName: string;
}

export default function Navigation({ pages, companyName }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
          <Link href="/" className="text-xl font-bold mb-4 md:mb-0 uppercase">
            {companyName}
          </Link>
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
            {pages.map((page) => {
              const href = page.slug ? `/${page.slug}` : "/";
              return (
                <Link
                  key={page.slug || "home"}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === href
                      ? "active"
                      : ""
                  }`}
                >
                  {page.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
