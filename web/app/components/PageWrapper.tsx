"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";

interface PageWrapperProps {
  children: ReactNode;
  backgroundImage?: ReactNode;
}

export default function PageWrapper({ children, backgroundImage }: PageWrapperProps) {
  const pathname = usePathname();
  const [stage, setStage] = useState<'entering' | 'visible' | 'exiting-content' | 'exiting-bg'>('entering');

  useEffect(() => {
    setStage('visible');
  }, [pathname]);

  return (
    <>
      {/* Background - exits after content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.96,
            delay: stage === 'exiting-bg' ? 0.96 : 0, // Wait for content on exit
            ease: [0.295, 0.85, 0.44, 1.0]
          }}
        >
          {backgroundImage}
        </motion.div>
      </AnimatePresence>

      {/* Content - exits first */}
      <AnimatePresence mode="wait">
        <div key={`content-${pathname}`}>
          {children}
        </div>
      </AnimatePresence>
    </>
  );
}
