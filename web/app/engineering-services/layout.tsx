"use client";

import { useEffect } from "react";

export default function EngineeringServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add dark class to html element on mount
    document.documentElement.classList.add("dark");

    // Remove dark class on unmount
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return <>{children}</>;
}
