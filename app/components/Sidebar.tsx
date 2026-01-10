'use client';

import React, { useState, useEffect } from 'react';

interface SidebarProps {
  activePage?: string;
  onNavigate?: (sectionId: string) => void;
}

export default function Sidebar({ activePage = 'home', onNavigate }: SidebarProps) {
  const [currentPage, setCurrentPage] = useState(activePage);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Sync with activePage prop
  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);

  const navItems: Array<{
    id: string;
    icon: string;
    label: string;
    sectionId: string;
    isDownload?: boolean;
  }> = [
    { id: 'home', icon: '⌂', label: 'Home', sectionId: 'home' },
    { id: 'profile', icon: '☺', label: 'Profile', sectionId: 'profile' },
    { id: 'experience', icon: '💼', label: 'Experience', sectionId: 'experience' },
    { id: 'contact', icon: '✎', label: 'Contact', sectionId: 'contact' },
    { id: 'resume', icon: '📄', label: 'Resume', sectionId: 'resume', isDownload: true },
  ];

  const handleClick = (itemId: string, sectionId: string, isDownload?: boolean) => {
    if (isDownload) {
      // Handle resume download
      const link = document.createElement('a');
      link.href = 'https://drive.google.com/uc?export=download&id=1SnzI9_AwCoMJEner8ZoKe3jjJP005_X3';
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    setCurrentPage(itemId);
    
    // Scroll to section using scrollTo and focus it
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for sticky header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Focus the section element after scroll (for accessibility)
      setTimeout(() => {
        element.focus();
      }, 300);
    }
    
    // Call the navigation callback if provided
    onNavigate?.(sectionId);
  };

  // Icon components for better rendering
  const Icon = ({ id }: { id: string }) => {
    const icons: Record<string, React.ReactElement> = {
      home: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      profile: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      experience: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
        </svg>
      ),
      contact: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      ),
      resume: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
    };
    return icons[id] || null;
  };

  return (
    <aside className="sticky top-4 md:top-8 w-full md:w-auto bg-[#1a1a1a] rounded-2xl flex flex-row md:flex-col items-center justify-center md:justify-start py-3 md:py-4 px-4 md:px-0 gap-2 md:gap-3 z-10 self-start md:w-14">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        const isHovered = hoveredItem === item.id;
        
        return (
        <button
          key={item.id}
          onClick={() => handleClick(item.id, item.sectionId, item.isDownload)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            isActive
              ? 'bg-[#8E8EFF] text-white'
              : isHovered
              ? 'bg-[#B8B8FF]/30 text-[#B8B8FF] border border-[#B8B8FF]/40'
              : 'text-white/70 hover:text-[#B8B8FF] hover:bg-[#B8B8FF]/20'
          }`}
          aria-label={item.label}
        >
          <Icon id={item.id} />
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none border border-white/10 shadow-lg z-50 md:block hidden">
            {item.label}
            {/* Tooltip arrow */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a1a]"></span>
          </span>
          {/* Mobile tooltip (below) */}
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none border border-white/10 shadow-lg z-50 md:hidden">
            {item.label}
            {/* Tooltip arrow */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#1a1a1a]"></span>
          </span>
        </button>
        );
      })}
    </aside>
  );
}

