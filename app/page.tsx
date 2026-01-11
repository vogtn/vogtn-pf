'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import GlassSection from './components/GlassSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleNavigate = (sectionId: string) => {
    setIsScrolling(true);
    // Don't set active section on sidebar click - only scroll
    // Active state will be set by hover or scroll detection
    // Reset scrolling flag after scroll completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Register section refs
  const registerSection = (id: string, element: HTMLElement | null) => {
    if (element) {
      sectionsRef.current.set(id, element);
    } else {
      sectionsRef.current.delete(id);
    }
  };

  // Detect which section is in view on scroll
  useEffect(() => {
    if (isScrolling) return;

    const handleScroll = () => {
      if (isScrolling || isHovering) return; // Don't update during programmatic scroll or when hovering
      
      const scrollPosition = window.scrollY + 150; // Offset for header
      
      // Find the section currently in view
      const sections = ['home', 'profile', 'experience', 'contact'];
      let currentSection = 'home';
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = sectionsRef.current.get(sectionId);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            currentSection = sectionId;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    // Use Intersection Observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling || isHovering) return; // Don't update when hovering
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all registered sections
    sectionsRef.current.forEach((element) => {
      observer.observe(element);
    });

    // Also listen to scroll for immediate feedback
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isScrolling, isHovering]);

  // Re-observe sections when they're registered
  useEffect(() => {
    if (sectionsRef.current.size === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling || isHovering) return; // Don't update when hovering
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all registered sections
    sectionsRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionsRef.current.size, isScrolling, isHovering]);

  // Track programmatic scrolling
  useEffect(() => {
    const handleScrollStart = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScrollStart, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollStart);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-white px-4 md:px-8 py-6 md:py-12 gap-4 md:gap-6">
      <Sidebar activePage={activeSection || 'home'} onNavigate={handleNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 max-w-4xl">
        {/* Updated Date */}
        <p className="text-gray-400 text-sm mb-6">Updated: {currentDate}</p>
        
        {/* Greetings Section */}
        <div 
          ref={(el) => registerSection('home', el)}
          id="home" 
          className="mb-16 scroll-mt-8 focus:outline-none focus:ring-2 focus:ring-[#9C9CFF] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-lg"
          tabIndex={0}
          onMouseEnter={() => {
            setIsHovering(true);
            setHoveredSection('home');
            setActiveSection('home');
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredSection(null);
            setActiveSection(null);
          }}
        >
          <h1 className="text-6xl font-serif mb-6 text-[#9C9CFF] font-[var(--font-serif)]">
            Hi!
          </h1>
          
          {/* Wavy Line with Decorations */}
          <div className="relative mb-12">
            <svg
              className="w-full h-4"
              viewBox="0 0 800 20"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,10 Q150,0 300,10 T600,10 T800,10"
                stroke="#5A5A9F"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
            
            {/* Decorative Elements */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
              
              {/* Periwinkle Square with Arrow */}
              <div className="relative">
                <div className="w-12 h-12 bg-[#8E8EFF] transform rotate-12 flex items-center justify-center">
                  <span className="text-white text-xl">↓</span>
                </div>
                {/* Small stars */}
                <span className="absolute -top-1 -left-1 text-[#B8B8FF] text-xs">⭐</span>
                <span className="absolute -bottom-1 -right-1 text-[#B8B8FF] text-xs">⭐</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Section */}
        <div 
          ref={(el) => registerSection('profile', el)}
          id="profile" 
          className="scroll-mt-8 focus:outline-none focus:ring-2 focus:ring-[#9C9CFF] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-lg"
          tabIndex={0}
          onMouseEnter={() => {
            setIsHovering(true);
            setHoveredSection('profile');
            setActiveSection('profile');
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredSection(null);
            // Delay clearing to allow smooth transitions
            setTimeout(() => {
              if (hoveredSection === 'profile') {
                setActiveSection(null);
              }
            }, 100);
          }}
        >
          <GlassSection 
            sectionId="profile"
            isActive={activeSection === 'profile'}
            hasActiveSection={activeSection !== null}
            onActiveChange={(active) => {
              if (active) {
                setIsHovering(true);
                setHoveredSection('profile');
                setActiveSection('profile');
              } else {
                setIsHovering(false);
                setHoveredSection(null);
                // Delay clearing to allow smooth transitions
                setTimeout(() => {
                  setActiveSection((prev) => prev === 'profile' ? null : prev);
                }, 100);
              }
            }}
          >
          
          <div className="space-y-6 text-white/90 leading-relaxed">
            <p className="text-lg">
              I am <span className="text-[#9C9CFF] font-semibold text-[2.25rem]">Nicolas Vogt</span> and I am a{' '}
              <span className="text-[#9C9CFF] font-semibold">Front End Engineer</span> with 8+ years of experience on teams ranging from startups to large enterprises like Microsoft, AT&T, and Verily.
            </p>
            
            <p className="text-lg">
              I love to build applications and experiences that are user-friendly and performant. My favorite part of this process is developing the relationships with my team, utilizing communication and collaboration with <span className="text-[#9C9CFF] font-semibold">designers</span>, 
              <span className="text-[#9C9CFF] font-semibold"> project managers</span>, and <span className="text-[#9C9CFF] font-semibold">other engineers</span> to achieve the best results.{' '}
            </p>
            <p className="text-lg">
             Friendly with <span className="text-[#9C9CFF] font-semibold hover:text-[#B8B8FF]">English</span>, <span className="text-[#9C9CFF] font-semibold hover:text-[#B8B8FF]">中文</span>, a bit of <span className="text-[#9C9CFF] font-semibold hover:text-[#B8B8FF]">日本话</span>.. always happy to learn more!
            </p>
            <p className="text-lg">
              Feel free to see the rest of my portfolio to get to know me better, or checkout my{' '}
              <a 
                href="https://drive.google.com/uc?export=download&id=1SnzI9_AwCoMJEner8ZoKe3jjJP005_X3" 
                download
                className="text-[#9C9CFF] font-semibold underline hover:text-[#B8B8FF] cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                resume
              </a>
              {' '}and contact information via the sidebar or links below. 
            </p>
          </div>
          </GlassSection>
        </div>
      
      {/* Experience Section */}
        <div 
          ref={(el) => registerSection('experience', el)}
          id="experience" 
          className="scroll-mt-8 focus:outline-none focus:ring-2 focus:ring-[#9C9CFF] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-lg"
          tabIndex={0}
          onMouseEnter={() => {
            setIsHovering(true);
            setHoveredSection('experience');
            setActiveSection('experience');
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredSection(null);
            setTimeout(() => {
              if (hoveredSection === 'experience') {
                setActiveSection(null);
              }
            }, 100);
          }}
        >
          <GlassSection 
            sectionId="experience"
            isActive={activeSection === 'experience'}
            hasActiveSection={activeSection !== null}
            onActiveChange={(active) => {
              if (active) {
                setIsHovering(true);
                setHoveredSection('experience');
                setActiveSection('experience');
              } else {
                setIsHovering(false);
                setHoveredSection(null);
                setTimeout(() => {
                  setActiveSection((prev) => prev === 'experience' ? null : prev);
                }, 100);
              }
            }}
          >
          <h2 className="text-2xl font-serif mb-8 text-[#9C9CFF] font-[var(--font-serif)]">
            Experience
          </h2>
          
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#9C9CFF]/30"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {/* Timeline Item 1 - Advanced Clinical, Verily */}
              <div className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#9C9CFF] border-4 border-[#0a0a0a] z-10"></div>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">Frontend Developer</h3>
                    <span className="text-sm text-[#9C9CFF] font-medium">Sep 2023 - Nov 2025</span>
                  </div>
                  <p className="text-[#9C9CFF] font-semibold">Advanced Clinical, Verily · Contract</p>
                  <p className="text-white/80 leading-relaxed">
                    Helped facilitate the transition from Java based AEM (Adobe Experience Manager) to a modern CMS, Webflow/vercel/TS. Worked with a team on consumer experience to help develop a platform for future healthcare.
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    <span className="text-[#9C9CFF]">Technologies:</span> ReactJs, Webflow, TS, AEM
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 - byrst */}
              <div className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#9C9CFF] border-4 border-[#0a0a0a] z-10"></div>
                
                <div className="space-y-2">
                  {/* byrst Logo */}
                  <div className="mb-3">
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">Frontend Developer</h3>
                    <span className="text-sm text-[#9C9CFF] font-medium">Aug 2022 - Jun 2023</span>
                  </div>
                  <p className="text-[#9C9CFF] font-semibold">byrst · Full-time · Remote</p>
                  <p className="text-white/80 leading-relaxed">
                    Worked closely with experienced UX designer to implement a Threejs (javascript) and React based platform to render 3d models and edit them on the web. Developed on a AWS serverless backend platform consuming gateway API based data. Utilized AWS federated logins for auth and route 53, s3, amplify patterns for implementation.
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    <span className="text-[#9C9CFF]">Technologies:</span> AWS, Amplify, Javascript, HTML, CSS, Threejs, Reactjs, React-three-fiber
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 - Microsoft */}
              <div className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#9C9CFF] border-4 border-[#0a0a0a] z-10"></div>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">Applications Dev & Test - Web Developer 3</h3>
                    <span className="text-sm text-[#9C9CFF] font-medium">May 2019 - Jun 2022</span>
                  </div>
                  <p className="text-[#9C9CFF] font-semibold">Microsoft · Contract · Redmond, WA</p>
                  <p className="text-white/80 leading-relaxed">
                    Software Engineer with the PAX team @Microsoft working on the open source,{' '}
                    <a href="https://github.com/microsoftgraph/microsoft-graph-toolkit" target="_blank" rel="noopener noreferrer" className="text-[#9C9CFF] underline hover:text-[#B8B8FF]">
                      Microsoft Graph Toolkit
                    </a>.
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    <span className="text-[#9C9CFF]">Technologies:</span> Typescript, Javascript, ShadowDOM, HTML, SCSS
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 - AT&T */}
              <div className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#9C9CFF] border-4 border-[#0a0a0a] z-10"></div>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">Front End Developer/Release Coordinator</h3>
                    <span className="text-sm text-[#9C9CFF] font-medium">Jun 2017 - May 2019</span>
                  </div>
                  <p className="text-[#9C9CFF] font-semibold">AT&T · Contract · Bothell, Washington</p>
                  <p className="text-white/80 leading-relaxed">
                    Contractor with AT&T&apos;s Rich Media Team, providing end to end solutions to implementing video content on the web. Responsibilities: Development (Javascript), Release Coordinator, Lead Tester.
                  </p>
                  <div className="text-white/80 text-sm mt-2 space-y-1">
                    <p><span className="text-[#9C9CFF] font-semibold">Applications worked on:</span></p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li><span className="text-[#9C9CFF] font-semibold">Global Video Player (GVP) Application:</span> A Typescript (javascript/shadowdom) UI library that utilizes a custom HTML element to create a comprehensive video player. Features include adaptive streaming, closed captioning, transcripts, common device support, custom video thumbnails and CTAs, federal accessibility compliance, and full device responsiveness.</li>
                      <li><span className="text-[#9C9CFF] font-semibold">Hero Application:</span> Reactjs/Javascript open HTML solution to building Ambient Video panels in AT&T&apos;s primary CMS. Utilizes a drag-and-drop interface that allows Content Implementers to easily configure an Ambient Video to any page.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Timeline Item 5 - Useful Labs Inc. */}
              <div className="relative pl-12">
                {/* Timeline Dot */}
                <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-[#9C9CFF] border-4 border-[#0a0a0a] z-10"></div>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">Consultant/Developer</h3>
                    <span className="text-sm text-[#9C9CFF] font-medium">Oct 2016 - Mar 2017</span>
                  </div>
                  <p className="text-[#9C9CFF] font-semibold">Useful Labs Inc.</p>
                  <p className="text-white/80 leading-relaxed">
                  What if sharing specific pieces of information about and with people was easier? Query.me is an approach to this solution. The Co-founders, Joseph, Mike, and Gentian, were generious enough to hire me as a consultant for this company, and I have been able to learn so much, from react-native development and the intracacies of xcode to the basics of developing as a team. So far most of my work has been provided towards the webpage itself, which is primarily built on react.
                  <p className="text-white/70 text-sm mt-2">
                    <span className="text-[#9C9CFF]">Technologies:</span> ReactJs, SCSS. Mobile Application - React-Native.
                  </p>
                  </p>
                </div>
              </div>
            </div>
          </div>
          </GlassSection>
        </div>
        
        {/* Contact Section - Placeholder */}
        <div 
          ref={(el) => registerSection('contact', el)}
          id="contact" 
          className="scroll-mt-8 mb-8 focus:outline-none focus:ring-2 focus:ring-[#9C9CFF] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-lg"
          tabIndex={0}
          onMouseEnter={() => {
            setIsHovering(true);
            setHoveredSection('contact');
            setActiveSection('contact');
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredSection(null);
            setTimeout(() => {
              if (hoveredSection === 'contact') {
                setActiveSection(null);
              }
            }, 100);
          }}
        >
          <GlassSection 
            sectionId="contact"
            isActive={activeSection === 'contact'}
            hasActiveSection={activeSection !== null}
            onActiveChange={(active) => {
              if (active) {
                setIsHovering(true);
                setHoveredSection('contact');
                setActiveSection('contact');
              } else {
                setIsHovering(false);
                setHoveredSection(null);
                setTimeout(() => {
                  setActiveSection((prev) => prev === 'contact' ? null : prev);
                }, 100);
              }
            }}
          >
            <h2 className="text-2xl font-serif mb-8 text-[#9C9CFF] font-[var(--font-serif)]">
              Contact
            </h2>
            <p className="text-white/80 text-lg">            <a 
                href="https://drive.google.com/uc?export=download&id=1SnzI9_AwCoMJEner8ZoKe3jjJP005_X3" 
                download
                className="text-[#9C9CFF] font-semibold underline hover:text-[#B8B8FF] cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg width="70" height="70" viewBox="0 0 50 50" fill="currentColor" className="inline-block" style={{ transform: 'translateY(20%)' }}>
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <p className="text-white/80 text-lg">  
                <span className="text-[#9C9CFF] font-semibold">resume</span> 
                </p>
              </a>
            </p>
            <p className="text-white/80 text-lg">            <a 
                href="mailto:nicolasjvogt@gmail.com"
                className="text-[#9C9CFF] font-semibold underline hover:text-[#B8B8FF] cursor-pointer inline-flex items-center gap-1.5"
              >
            <svg width="70" height="70" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateY(34%)' }}>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -922.000000)" fill="#ffffff">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path d="M262,764.291 L254,771.318 L246,764.281 L246,764 L262,764 L262,764.291 Z M246,775 L246,766.945 L254,773.98 L262,766.953 L262,775 L246,775 Z M244,777 L264,777 L264,762 L244,762 L244,777 Z" id="email-[#1573]">
                                </path>
                            </g>
                        </g>
                    </g>
                </svg>
                <p className="text-white/80 text-lg" >  
                <span className="text-[#9C9CFF] font-semibold">nicolasjvogt@gmail.com</span> 
                </p>
               </a>
            </p>
          </GlassSection>
        </div>
      </main>
    </div>
  );
}
