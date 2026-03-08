"use client";

import { useEffect, useState } from "react";
import ResponsiveImage from "./ResponsiveImage";

interface BackgroundImageProps {
  desktop: string;
  mobile?: string;
  alt: string;
}

export default function BackgroundImage({ desktop, mobile, alt }: BackgroundImageProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Watch for page-exiting class on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const exiting = document.body.classList.contains('page-exiting');
          setIsExiting(exiting);
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`background-image ${isExiting ? 'exiting' : ''} fixed inset-0 -z-10`}>
      <ResponsiveImage desktop={desktop} mobile={mobile} alt={alt} />
    </div>
  );
}
