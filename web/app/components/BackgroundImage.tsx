"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import ResponsiveImage from "./ResponsiveImage";

interface BackgroundImageProps {
  desktop: string;
  mobile?: string;
  alt: string;
}

export default function BackgroundImage({ desktop, mobile, alt }: BackgroundImageProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Watch for page-exiting class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isExiting = document.body.classList.contains('page-exiting');
          if (isExiting) {
            // Wait 240ms after content starts, then fade out
            setTimeout(() => {
              animate(scope.current, { opacity: 0 }, { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] });
            }, 240);
          }
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, [animate, scope]);

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{
        duration: 0.96,
        ease: [0.295, 0.85, 0.44, 1.0],
      }}
    >
      <ResponsiveImage desktop={desktop} mobile={mobile} alt={alt} />
    </motion.div>
  );
}
