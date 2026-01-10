'use client';

import { useRef, useState, MouseEvent } from 'react';

interface GlassSectionProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  hasActiveSection?: boolean;
  onActiveChange?: (active: boolean) => void;
  sectionId?: string;
}

export default function GlassSection({ 
  children, 
  className = '', 
  isActive = false,
  hasActiveSection = false,
  onActiveChange,
  sectionId 
}: GlassSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onActiveChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onActiveChange?.(false);
  };

  return (
    <section
      ref={sectionRef}
      className={`p-6 rounded-3xl transition-all duration-500 ease-out mb-8 relative overflow-hidden ${
        isActive 
          ? 'bg-white/[0.12] backdrop-blur-xl backdrop-saturate-150 border border-white/30 shadow-2xl shadow-black/40 z-20' 
          : isHovered
          ? 'bg-white/[0.08] backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-2xl shadow-black/20'
          : ''
      } ${
        hasActiveSection && !isActive ? 'opacity-40 blur-[2px] grayscale-[20%]' : ''
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: isHovered || isActive
          ? `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(156, 156, 255, 0.08), transparent 50%), radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(184, 184, 255, 0.03), transparent 70%)`
          : undefined,
        transform: isActive ? 'scale(1.02) translateZ(20px)' : 'scale(1) translateZ(0)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </section>
  );
}

