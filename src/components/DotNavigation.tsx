import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'products', label: 'Products' },
  { id: 'technology', label: 'Technology' },
  { id: 'timeline', label: 'Journey' },
  { id: 'research', label: 'Research' },
  { id: 'team', label: 'Team' },
  { id: 'news', label: 'News' },
  { id: 'contact', label: 'Contact' }
];

const DotNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px'
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col items-center gap-3">
        {sections.map(({ id, label }, index) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center"
            aria-label={`Scroll to ${label}`}
          >
            <span className="absolute right-full mr-4 py-1 px-2 rounded-md bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-sm">
              {label}
            </span>
            <motion.div
              className="relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 shadow-lg shadow-gold-500/30'
                    : 'bg-gray-300 group-hover:bg-gold-300'
                }`}
              />
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-sm scale-150'
                    : 'opacity-0'
                }`}
              />
              {activeSection === id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400/30 to-gold-600/30"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DotNavigation;