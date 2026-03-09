"use client";

import { useState, useRef, useEffect } from "react";
import { useAnimate } from "framer-motion";
import TransitionLink from "./TransitionLink";
import Icon from "./Icons";

interface SubmenuItem {
  label: string;
  link: string;
  description?: string;
}

interface MenuItem {
  label: string;
  link: string;
  submenu?: SubmenuItem[];
}

interface MainNavProps {
  menuItems: MenuItem[];
  companyName?: string;
}

// Animation constants
const ANIMATION_EASING = [0.295, 0.85, 0.44, 1.0] as const;
const ANIMATION_DURATION = 0.48;
const SUBMENU_STAGGER_DELAY = 240;
const MOBILE_CLOSE_DELAY = 1000;
const MOBILE_CONTENT_DELAY = 480;

// Mobile menu item with animated submenu
function MobileMenuItem({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentScope, animateContent] = useAnimate();
  const [wrapperScope, animateWrapper] = useAnimate();
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = async () => {
    if (!item.submenu || !contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;

    if (!isOpen) {
      setIsOpen(true);
      await animateWrapper(wrapperScope.current, { height: contentHeight }, { duration: ANIMATION_DURATION, ease: ANIMATION_EASING });
      await animateContent(contentScope.current, { opacity: 1 }, { duration: ANIMATION_DURATION, ease: ANIMATION_EASING });
    } else {
      await animateContent(contentScope.current, { opacity: 0 }, { duration: ANIMATION_DURATION, ease: ANIMATION_EASING });
      await animateWrapper(wrapperScope.current, { height: 0 }, { duration: ANIMATION_DURATION, ease: ANIMATION_EASING });
      setIsOpen(false);
    }
  };

  if (!item.submenu?.length) {
    return (
      <div onClick={onClose}>
        <TransitionLink href={item.link} className="text-lg-m">
          {item.label}
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div onClick={onClose}>
          <TransitionLink href={item.link} className="text-lg-m">
            {item.label}
          </TransitionLink>
        </div>
        <button 
          onClick={toggleSubmenu}
          className="p-1 -m-1 pt-2" 
          aria-label={`Toggle ${item.label} submenu`}
          aria-expanded={isOpen}
        >
          <Icon 
            name="chevron" 
            className={`w-4 h-2 fill-black dark:fill-white transition-transform duration-md ease-gwk ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
      
      <div ref={wrapperScope} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={contentRef}>
          <div ref={contentScope} className="py-4 pl-2" style={{ opacity: 0 }}>
            <ul className="flex flex-col gap-2">
              {item.submenu.map((subitem) => (
                <li key={subitem.link} onClick={onClose}>
                  <TransitionLink href={subitem.link} className="text-lg-m">
                    {subitem.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainNav({ menuItems, companyName }: MainNavProps) {
  // Desktop menu state
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBackgroundVisible, setMobileBackgroundVisible] = useState(false);
  const [mobileContentVisible, setMobileContentVisible] = useState(false);
  const [menuAnnouncement, setMenuAnnouncement] = useState('');
  
  // Refs
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openAnimationRef = useRef<number | null>(null);
  const mobileCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Desktop menu handlers
  const closeDropdown = () => {
    if (openAnimationRef.current) {
      cancelAnimationFrame(openAnimationRef.current);
      openAnimationRef.current = null;
    }
    
    setIsOpen(false);
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), ANIMATION_DURATION * 1000 + (SUBMENU_STAGGER_DELAY * 3));
  };

  const handleWrapperEnter = (index: number, hasSubmenu: boolean) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    if (hasSubmenu) {
      setActiveDropdown(index);
      openAnimationRef.current = requestAnimationFrame(() => setIsOpen(true));
    }
  };

  // Mobile menu handlers
  const handleMobileToggle = () => {
    const willOpen = !mobileMenuOpen;
    setMobileMenuOpen(willOpen);
    setMenuAnnouncement(willOpen ? 'Navigation menu opened' : '');
  };

  const handleMobileClose = () => {
    setMobileContentVisible(false);
    setMenuAnnouncement('Navigation menu closed');
    
    mobileCloseTimeoutRef.current = setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileBackgroundVisible(false);
      menuButtonRef.current?.focus();
    }, MOBILE_CLOSE_DELAY);
  };

  // Keyboard event handlers
  const handleMobileToggleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMobileToggle();
    }
  };

  const handleMobileCloseKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMobileClose();
    }
  };

  // Mobile menu animations
  useEffect(() => {
    if (!mobileMenuOpen) return;

    requestAnimationFrame(() => setMobileBackgroundVisible(true));
    const contentTimeout = setTimeout(() => setMobileContentVisible(true), MOBILE_CONTENT_DELAY);

    return () => {
      clearTimeout(contentTimeout);
      if (mobileCloseTimeoutRef.current) clearTimeout(mobileCloseTimeoutRef.current);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Focus trap and Escape key handler for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen || !mobileMenuRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMobileClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = mobileMenuRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {menuAnnouncement}
      </div>
      
      {/* Desktop Menu */}
      <nav aria-label="Main navigation" className="contents">
        <ul className="contents">
          {menuItems.map((item, index) => (
            <li
              key={item.link}
              className={`hidden pb-4 lg:flex flex-col justify-start items-start lg:col-start-${6 + index * 2} lg:col-span-2 text-sm-x relative`}
              onMouseLeave={closeDropdown}
            >
              {item.submenu?.length ? (
                <>
                  <div onMouseEnter={() => handleWrapperEnter(index, true)} onClick={closeDropdown}>
                    <TransitionLink href={item.link} className="flex items-center gap-1">
                      {item.label}
                      <div className="pt-1">
                        <Icon name="chevron" className="w-2 h-1 fill-black dark:fill-white transition-colors duration-lg ease-gwk" />
                      </div>
                    </TransitionLink>
                  </div>
                  
                  <ul className={`absolute top-6 left-0 py-6 flex flex-col gap-6 ${activeDropdown !== index ? 'invisible pointer-events-none' : ''}`}>
                    {item.submenu.map((subitem, subIndex) => {
                      const delay = isOpen 
                        ? subIndex * SUBMENU_STAGGER_DELAY
                        : (item.submenu!.length - 1 - subIndex) * SUBMENU_STAGGER_DELAY;
                      
                      return (
                        <li
                          key={subitem.link}
                          onClick={closeDropdown}
                          className={`transition-opacity duration-md ease-gwk ${activeDropdown === index && isOpen ? 'opacity-100' : 'opacity-0'}`}
                          style={{
                            transitionDelay: `${delay}ms`,
                          }}
                        >
                          <TransitionLink href={subitem.link}>
                            {subitem.label}
                          </TransitionLink>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <TransitionLink href={item.link}>{item.label}</TransitionLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex justify-end items-start lg:hidden col-start-4 col-span-1 text-sm-x">
        <button 
          ref={menuButtonRef}
          onClick={handleMobileToggle}
          onKeyDown={handleMobileToggleKeyDown}
          aria-label="Open navigation menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef} 
          className="fixed inset-0 z-9999 lg:hidden overflow-y-auto flex flex-col p-6 bg-white dark:bg-black transition-opacity duration-md ease-gwk" 
          style={{ opacity: mobileBackgroundVisible ? 1 : 0 }} 
          role="dialog" 
          aria-modal="true"
        >
          <div className="flex flex-row justify-between items-start">
            <div onClick={handleMobileClose}>
              <TransitionLink href="/" aria-label={companyName}>
                <Icon name="logo" className="fill-black dark:fill-white h-18" />
              </TransitionLink>
            </div>
            <button className="text-sm-x" onClick={handleMobileClose} onKeyDown={handleMobileCloseKeyDown} aria-label="Close navigation menu">
              Close
            </button>
          </div>
        
          <div className="grow flex flex-col">
            <nav aria-label="Mobile navigation" className="mt-40">
              <ul 
                className="flex flex-col gap-4 self-start transition-opacity duration-md ease-gwk"
                style={{
                  opacity: mobileContentVisible ? 1 : 0,
                }}
              >
                {menuItems.map((item) => (
                  <li key={item.link}>
                    <MobileMenuItem item={item} onClose={handleMobileClose} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div 
            className="text-sm-x transition-opacity duration-md ease-gwk"
            style={{
              opacity: mobileContentVisible ? 1 : 0,
            }}
          >
            &copy; {new Date().getFullYear()} {companyName} 
          </div>
        </div>
      )}
    </>
  );
}
