"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export default function TransitionLink({ href, children, className, "aria-label": ariaLabel }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't animate if clicking the current page
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    // Allow cmd+click (Mac), ctrl+click (PC), middle-click to open in new tab
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return; // Let browser handle it normally
    }

    e.preventDefault();
    
    // Trigger exit animations by adding class to body
    document.body.classList.add('page-exiting');
    
    // Wait for content + bg to exit (bg starts at 240ms, runs 480ms = 720ms total)
    setTimeout(() => {
      router.push(href);
      document.body.classList.remove('page-exiting');
    }, 720);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
