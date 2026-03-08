"use client";

import { motion, useAnimate } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface TransitionBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function TransitionBlock({ children, className = "", delay = 0 }: TransitionBlockProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Watch for page-exiting class
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isExiting = document.body.classList.contains('page-exiting');
          if (isExiting) {
            // All content exits together immediately
            animate(scope.current, { opacity: 0, x: 0 }, { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] });
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
      className={className}
      initial={{ opacity: 0, x: 5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.96, 
        delay: delay,
        ease: [0.295, 0.85, 0.44, 1.0]
      }}
    >
      {children}
    </motion.div>
  );
}
