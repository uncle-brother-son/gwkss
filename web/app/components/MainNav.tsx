"use client";

import { useState, useRef } from "react";
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
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openAnimationRef = useRef<number | null>(null);

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
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
    setExpandedItem(null);
  };

  const toggleSubmenu = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <>
      {/* Desktop Menu */}
      {menuItems.map((item, index) => {
        const isActive = activeDropdown === index;
        
        return (
          <div
            key={item.link}
            className={`hidden lg:flex flex-col justify-start items-start ${getColumnClass(index)} text-sm-x relative`}
            onMouseLeave={handleWrapperLeave}
          >
            {item.submenu && item.submenu.length > 0 ? (
              <>
                <div onMouseEnter={() => handleWrapperEnter(index, true)} onClick={handleLinkClick} >
                  <TransitionLink href={item.link} className="flex items-center gap-1">
                    {item.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </TransitionLink>
                </div>
                
                {isActive && (
                  <div className="absolute top-6 left-0 py-6 flex flex-col gap-6">
                    {item.submenu.map((subitem, subIndex) => {
                      const totalItems = item.submenu!.length;
                      const delay = isOpen 
                        ? subIndex * 240 // Forward: 0, 240, 480...
                        : (totalItems - 1 - subIndex) * 240; // Reverse: 480, 240, 0...
                      
                      return (
                        <div
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <TransitionLink href={item.link}>{item.label}</TransitionLink>
            )}
          </div>
        );
      })}

      {/* Mobile Menu Button */}
      <div className="flex justify-end items-start lg:hidden col-start-4 col-span-1 text-sm-x">
        <button onClick={handleMobileToggle}>Menu</button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black z-9999 lg:hidden overflow-y-auto flex flex-col p-6 gap-y-60">
            
            {/* Header */}
            <div className="flex flex-row justify-between items-start">
              <div onClick={handleMobileClose}>
                <TransitionLink href="/" aria-label={companyName}>
                  <Icon name="logo" className="fill-black dark:fill-white h-14" />
                </TransitionLink>
              </div>
              <button className="text-sm-x" onClick={handleMobileClose}>Close</button>
            </div>
          

            {/* Menu Items */}
            <div className="grow flex flex-col gap-4 self-start">
              {menuItems.map((item, index) => (
                <div key={item.link} className="flex flex-col">
                  {item.submenu && item.submenu.length > 0 ? (
                    <>
                      <button onClick={() => toggleSubmenu(index)} className="text-md text-left flex items-center gap-2">
                        {item.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      
                      {expandedItem === index && (
                        <div className="my-4 ml-2 flex flex-col gap-2">
                          {item.submenu.map((subitem) => (
                            <div key={subitem.link} onClick={handleMobileClose}>
                              <TransitionLink href={subitem.link} className="text-md">
                                {subitem.label}
                              </TransitionLink>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div onClick={handleMobileClose}>
                      <TransitionLink href={item.link} className="text-md">
                        {item.label}
                      </TransitionLink>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm-x">
              &copy; {new Date().getFullYear()} {companyName} 
            </div>

        </div>
      )}
    </>
  );
}
