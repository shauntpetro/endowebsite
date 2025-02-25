import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Technology from './components/Technology';
import CompanyTimeline from './components/CompanyTimeline';
import ResearchPublications from './components/ResearchPublications';
import Team from './components/Team';
import LatestNews from './components/LatestNews';
import Contact from './components/Contact';
import DotNavigation from './components/DotNavigation';
import Footer from './components/Footer';
import InvestorPortal from './components/InvestorPortal';
import NotificationSystem from './components/NotificationSystem';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPage } from './components/admin/AdminPage';
import { useState, useEffect } from 'react';
import { useAuth } from './components/auth/AuthContext';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPage, setShowAdminPage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleToggleAuth = () => setShowAuthModal(prev => !prev);
    const handleToggleAdmin = () => setShowAdminPage(prev => !prev);
    
    document.addEventListener('toggle-auth-modal', handleToggleAuth);
    document.addEventListener('toggle-admin-page', handleToggleAdmin);
    
    return () => {
      document.removeEventListener('toggle-auth-modal', handleToggleAuth);
      document.removeEventListener('toggle-admin-page', handleToggleAdmin);
    };
  }, []);

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gold-500 origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar />
      <DotNavigation />
      
      {showAdminPage && isAdmin ? (
        <AdminPage />
      ) : (
        <main className="relative">
          <section id="home" className="min-h-screen">
            <Hero />
          </section>

          <section id="about" className="scroll-mt-16 section-spacing-sm">
            <About />
          </section>

          <section id="products" className="scroll-mt-16 section-spacing">
            <Products />
          </section>

          <section id="technology" className="scroll-mt-16 section-spacing">
            <Technology />
          </section>

          <section id="timeline" className="scroll-mt-16 section-spacing-sm">
            <CompanyTimeline />
          </section>

          <section id="research" className="scroll-mt-16 section-spacing">
            <ResearchPublications />
          </section>

          <section id="team" className="scroll-mt-16 section-spacing-sm">
            <Team />
          </section>

          <section id="news" className="scroll-mt-16 section-spacing-sm">
            <LatestNews />
          </section>

          <section id="contact" className="scroll-mt-16 section-spacing">
            <Contact />
          </section>
        </main>
      )}

      <Footer />
      <InvestorPortal />
      <NotificationSystem />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default App;