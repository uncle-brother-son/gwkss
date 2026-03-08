"use client";

import { useState, useRef, useEffect } from "react";
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

export default function MainNav({ menuItems, companyName }: MainNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileBackgroundVisible, setMobileBackgroundVisible] = useState(false);
  const [mobileContentVisible, setMobileContentVisible] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [menuAnnouncement, setMenuAnnouncement] = useState('');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openAnimationRef = useRef<number | null>(null);
  const mobileCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Calculate grid column positions based on number of menu items
  const getColumnClass = (index: number) => {
    const startCol = 6 + index * 2;
    return `lg:col-start-${startCol} lg:col-span-2`;
  };

  const handleWrapperEnter = (index: number, hasSubmenu: boolean) => {
    // Clear any pending close
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    if (hasSubmenu) {
      setActiveDropdown(index);
      // Trigger animation on next frame to ensure elements are mounted first
      openAnimationRef.current = requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }
  };

  const handleWrapperLeave = () => {
    // Cancel any pending open animation
    if (openAnimationRef.current) {
      cancelAnimationFrame(openAnimationRef.current);
      openAnimationRef.current = null;
    }
    
    setIsOpen(false);
    
    // Remove dropdown after animations complete
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 480 + (240 * 3)); // Max animation time
  };

  const handleLinkClick = () => {
    // Cancel any pending open animation
    if (openAnimationRef.current) {
      cancelAnimationFrame(openAnimationRef.current);
      openAnimationRef.current = null;
    }
    
    setIsOpen(false);
    
    // Remove dropdown after animations complete
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 480 + (240 * 3)); // Max animation time
  };

  const handleMobileToggle = () => {
    const willOpen = !mobileMenuOpen;
    setMobileMenuOpen(willOpen);
    setMenuAnnouncement(willOpen ? 'Navigation menu opened' : '');
  };

  const handleMobileClose = () => {
    // Fade out content first
    setMobileContentVisible(false);
    setMenuAnnouncement('Navigation menu closed');
    
    // Remove background after page transition completes
    // PageTransition uses mode="wait" with 0.5s duration for both exit and enter
    // Exit: 500ms + Enter: 500ms = 1000ms total
    mobileCloseTimeoutRef.current = setTimeout(() => {
      setMobileMenuOpen(false);
      setExpandedItem(null);
      // Reset states
      setMobileBackgroundVisible(false);
      // Restore focus to menu button
      if (menuButtonRef.current) {
        menuButtonRef.current.focus();
      }
    }, 1000);
  };

  const toggleSubmenu = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Keyboard handlers
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

  const handleSubmenuToggleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSubmenu(index);
    }
  };

  // Animate mobile menu on open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Fade in background first
      requestAnimationFrame(() => {
        setMobileBackgroundVisible(true);
      });
      
      // Then fade in content after background animation (480ms)
      const contentTimeout = setTimeout(() => {
        setMobileContentVisible(true);
      }, 480);

      return () => clearTimeout(contentTimeout);
    }

    return () => {
      if (mobileCloseTimeoutRef.current) {
        clearTimeout(mobileCloseTimeoutRef.current);
      }
    };
  }, [mobileMenuOpen]);

  // Focus trap and Escape key handler for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen || !mobileMenuRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        handleMobileClose();
        return;
      }

      // Focus trap on Tab
      if (e.key === 'Tab') {
        const focusableElements = mobileMenuRef.current?.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift+Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Screen reader announcement for mobile menu state */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {menuAnnouncement}
      </div>
      
      {/* Desktop Menu */}
      <nav aria-label="Main navigation" className="contents">
        <ul className="contents">
          {menuItems.map((item, index) => {
            const isActive = activeDropdown === index;
            
            return (
              <li
                key={item.link}
                className={`hidden lg:flex flex-col justify-start items-start ${getColumnClass(index)} text-sm-x relative`}
                onMouseLeave={handleWrapperLeave}
              >
                {item.submenu && item.submenu.length > 0 ? (
                  <>
                    <div onMouseEnter={() => handleWrapperEnter(index, true)} onClick={handleLinkClick} >
                      <TransitionLink href={item.link} className="flex items-center gap-1">
                        {item.label}
                        <div className="pt-1"><Icon name="chevron" className="w-2 h-1 fill-black dark:fill-white transition-colors duration-lg ease-gwk" /></div>
                      </TransitionLink>
                    </div>
                    
                    {isActive && (
                      <ul className="absolute top-6 left-0 py-6 flex flex-col gap-6">
                        {item.submenu.map((subitem, subIndex) => {
                          const totalItems = item.submenu!.length;
                          const delay = isOpen 
                            ? subIndex * 240 // Forward: 0, 240, 480...
                            : (totalItems - 1 - subIndex) * 240; // Reverse: 480, 240, 0...
                          
                          return (
                            <li
                              key={subitem.link}
                              onClick={handleLinkClick}
                              className={`opacity-0 transition-opacity duration-md ${isOpen ? 'opacity-100' : ''}`}
                              style={{
                                transitionDelay: `${delay}ms`,
                                transitionTimingFunction: 'cubic-bezier(0.295, 0.850, 0.440, 1.000)',
                              }}
                            >
                              <TransitionLink href={subitem.link}>
                                {subitem.label}
                              </TransitionLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <TransitionLink href={item.link}>{item.label}</TransitionLink>
                )}
              </li>
            );
          })}
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
        <div ref={mobileMenuRef} className="fixed inset-0 z-9999 lg:hidden overflow-y-auto">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-white dark:bg-black transition duration-lg ease-gwk"
            style={{
              opacity: mobileBackgroundVisible ? 1 : 0,
              transitionTimingFunction: 'cubic-bezier(0.295, 0.850, 0.440, 1.000)',
            }}
          />
          
          {/* Content Container */}
          <div className="relative flex flex-col p-6 gap-y-60 min-h-full">
            
            {/* Header - No fade */}
            <div className="flex flex-row justify-between items-start">
              <div onClick={handleMobileClose}>
                <TransitionLink href="/" aria-label={companyName}>
                  <Icon name="logo" className="fill-black dark:fill-white h-18" />
                </TransitionLink>
              </div>
              <button 
                className="text-sm-x" 
                onClick={handleMobileClose}
                onKeyDown={handleMobileCloseKeyDown}
                aria-label="Close navigation menu"
              >
                Close
              </button>
            </div>
          
            {/* Menu Items - Fade in/out */}
            <nav aria-label="Mobile navigation" className="grow">
              <ul 
                className="flex flex-col gap-4 self-start transition-opacity duration-md"
                style={{
                  opacity: mobileContentVisible ? 1 : 0,
                  transitionTimingFunction: 'cubic-bezier(0.295, 0.850, 0.440, 1.000)',
                }}
              >
                {menuItems.map((item, index) => (
                  <li key={item.link} className="flex flex-col">
                    {item.submenu && item.submenu.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div onClick={handleMobileClose}>
                            <TransitionLink href={item.link} className="text-lg-m">
                              {item.label}
                            </TransitionLink>
                          </div>
                          <button 
                            onClick={() => toggleSubmenu(index)}
                            onKeyDown={(e) => handleSubmenuToggleKeyDown(e, index)}
                            className="p-1 -m-1 pt-2" 
                            aria-label={`Toggle ${item.label} submenu`}
                            aria-expanded={expandedItem === index}
                          >
                            <Icon name="chevron" className={`w-4 h-2 fill-black dark:fill-white transition duration-md ${expandedItem === index ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {expandedItem === index && (
                          <ul className="my-4 ml-2 flex flex-col gap-2">
                            {item.submenu.map((subitem) => (
                              <li key={subitem.link} onClick={handleMobileClose}>
                                <TransitionLink href={subitem.link} className="text-lg-m">
                                  {subitem.label}
                                </TransitionLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <div onClick={handleMobileClose}>
                        <TransitionLink href={item.link} className="text-lg-m">
                          {item.label}
                        </TransitionLink>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Copyright - Fade in/out */}
            <div 
              className="text-sm-x transition-opacity duration-md"
              style={{
                opacity: mobileContentVisible ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.295, 0.850, 0.440, 1.000)',
              }}
            >
              &copy; {new Date().getFullYear()} {companyName} 
            </div>
          </div>
        </div>
      )}
    </>
  );
}
