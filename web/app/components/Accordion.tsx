"use client";

import { useState, useRef } from "react";
import { useAnimate } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Icon from "./Icons";

interface AccordionSection {
  title: string;
  content: PortableTextBlock[];
}

interface AccordionProps {
  sections: AccordionSection[];
}

function AccordionItem({ section }: { section: AccordionSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentScope, animateContent] = useAnimate();
  const [wrapperScope, animateWrapper] = useAnimate();
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = async () => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;

    if (!isOpen) {
      // Opening sequence: expand height (480ms) → fade in content (480ms)
      setIsOpen(true);
      
      // 1. Expand height
      await animateWrapper(
        wrapperScope.current,
        { height: contentHeight },
        { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] }
      );
      
      // 2. Fade in content
      await animateContent(
        contentScope.current,
        { opacity: 1 },
        { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] }
      );
    } else {
      // Closing sequence: fade out content (480ms) → shrink height (480ms)
      
      // 1. Fade out content
      await animateContent(
        contentScope.current,
        { opacity: 0 },
        { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] }
      );
      
      // 2. Shrink height
      await animateWrapper(
        wrapperScope.current,
        { height: 0 },
        { duration: 0.48, ease: [0.295, 0.85, 0.44, 1.0] }
      );
      
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button 
        onClick={toggleAccordion}
        className="flex items-center justify-between"
        aria-expanded={isOpen}
      >
        <span>{section.title}</span>
        <Icon 
          name={isOpen ? "minus" : "plus"} 
          className="fill-black dark:fill-white h-3.5 shrink-0 ml-4" 
        />
      </button>
      
      <div 
        ref={wrapperScope}
        className="overflow-hidden"
        style={{ height: 0 }}
      >
        <div 
          ref={contentScope}
          style={{ opacity: 0 }}
        >
          <div ref={contentRef} className="text-sm rich p-2 pb-4 pr-4">
            <PortableText value={section.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ sections }: AccordionProps) {
  return (
    <div className="space-y-2 mt-6">
      {sections.map((section, index) => (
        <AccordionItem key={index} section={section} />
      ))}
    </div>
  );
}
