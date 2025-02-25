import React from 'react';

export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-white text-gold-600 px-4 py-2 rounded-md shadow-lg
                 focus:outline-none focus:ring-2 focus:ring-gold-500"
    >
      Skip to main content
    </a>
  );
};