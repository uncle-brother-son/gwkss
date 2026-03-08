"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface TransitionBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function TransitionBlock({ children, className = "", delay = 0 }: TransitionBlockProps) {
  const [isExiting, setIsExiting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // Entry: base 240ms + stagger delay
  // Exit: no delay (0ms)
  const totalDelay = isExiting ? 0 : 0.24 + delay;
  const style = { animationDelay: `${totalDelay}s` };

  return (
    <div
      ref={ref}
      className={`transition-block ${isExiting ? 'exiting' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
