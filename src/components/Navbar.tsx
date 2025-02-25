import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Lock, LogIn, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { useSupabase } from '../context/SupabaseContext';

const navigation = [
  { name: 'About Us', href: '#about' },
  {
    name: 'Portfolio & Technology',
    href: '#products',
    submenu: [
      { name: 'Products', href: '#products' },
      { name: 'Technology Platform', href: '#technology' }
    ]
  },
  { name: 'Journey', href: '#timeline' },
  {
    name: 'Research',
    href: '#research',
    submenu: [
      { name: 'Publications', href: '#research' },
      { name: 'Team', href: '#team' }
    ]
  },
  { name: 'News', href: '#news' },
  { name: 'Contact', href: '#contact' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, investorStatus } = useAuth();
  const { signOut } = useSupabase();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      setScrolled(scrollPosition > 50);
      setPastHero(scrollPosition > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    setActiveDropdown(null);
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      document.dispatchEvent(new CustomEvent('toggle-auth-modal'));
    }
  };

  const handleInvestorPortalClick = () => {
    if (!user) {
      document.dispatchEvent(new CustomEvent('toggle-auth-modal'));
    } else {
      document.dispatchEvent(new CustomEvent('toggle-investor-portal'));
    }
  };

  const handleAdminClick = () => {
    document.dispatchEvent(new CustomEvent('toggle-admin-page'));
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: pastHero ? 8 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      className="fixed top-0 w-full z-50"
    >
      <div className="mx-auto w-[98%] max-w-7xl">
        <div className={`mx-auto rounded-xl transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
        }`}>
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <motion.a
                  href="#home"
                  className="flex items-center gap-3 group"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('#home');
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img 
                    src="/surd172cn89q7be8l7juajptab.png" 
                    alt="EndoCyclic Therapeutics Logo" 
                    className="h-12 w-auto transition-opacity duration-300"
                  />
                  <div className={`text-lg lg:text-xl font-display font-bold transition-colors duration-300 ${
                    scrolled ? 'text-gray-900' : 'text-white'
                  }`}>
                    EndoCyclic Therapeutics
                  </div>
                </motion.a>
              </div>

              <div className="hidden md:flex md:items-center md:space-x-2">
                {navigation.map((item) => (
                  <div key={item.name} className="relative group">
                    <button
                      onClick={() => {
                        if (item.submenu) {
                          setActiveDropdown(activeDropdown === item.name ? null : item.name);
                        } else {
                          scrollToSection(item.href);
                        }
                      }}
                      className={`px-2.5 py-1.5 text-sm font-medium transition-all duration-300 flex items-center space-x-1 hover:scale-105 rounded-lg ${
                        scrolled 
                          ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.submenu && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {item.submenu && (
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-1 w-56 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm border border-white/20"
                          >
                            <div className="py-1">
                              {item.submenu.map((subItem) => (
                                <motion.a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(subItem.href);
                                  }}
                                  whileHover={{ x: 6 }}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors duration-200"
                                >
                                  {subItem.name}
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-2 ml-4">
                  {isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAdminClick}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 ${
                        scrolled
                          ? 'bg-white text-gold-600 hover:bg-gold-50 border border-gold-200 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <Settings size={16} />
                      <span>Admin</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInvestorPortalClick}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 ${
                      scrolled
                        ? 'bg-white text-gold-600 hover:bg-gold-50 border border-gold-200 shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Lock size={16} />
                    <span>Investor Portal</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAuthClick}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 ${
                      scrolled
                        ? 'bg-white text-gold-600 hover:bg-gold-50 border border-gold-200 shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {user ? (
                      <>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={16} />
                        <span>Sign In</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`p-1.5 rounded-lg transition-colors duration-300 ${
                    scrolled 
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                      : 'text-white hover:text-white/80 hover:bg-white/10'
                  }`}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/10 rounded-b-xl overflow-hidden"
              >
                <div className="px-3 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <button
                        onClick={() => {
                          if (item.submenu) {
                            setActiveDropdown(activeDropdown === item.name ? null : item.name);
                          } else {
                            scrollToSection(item.href);
                          }
                        }}
                        className="w-full text-left px-2.5 py-2 text-base font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between rounded-lg hover:bg-gray-50"
                      >
                        {item.name}
                        {item.submenu && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>

                      {item.submenu && activeDropdown === item.name && (
                        <div className="pl-4 space-y-1">
                          {item.submenu.map((subItem) => (
                            <motion.a
                              key={subItem.name}
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(subItem.href);
                              }}
                              whileHover={{ x: 4 }}
                              className="block px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                            >
                              {subItem.name}
                            </motion.a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-2 space-y-2">
                    {isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsOpen(false);
                          handleAdminClick();
                        }}
                        className="w-full px-4 py-2 text-base font-medium bg-white text-gold-600 hover:bg-gold-50 rounded-full border border-gold-200 shadow-sm flex items-center gap-2 justify-center"
                      >
                        <Settings size={18} />
                        <span>Admin</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsOpen(false);
                        handleInvestorPortalClick();
                      }}
                      className="w-full px-4 py-2 text-base font-medium bg-white text-gold-600 hover:bg-gold-50 rounded-full border border-gold-200 shadow-sm flex items-center gap-2 justify-center"
                    >
                      <Lock size={18} />
                      <span>Investor Portal</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsOpen(false);
                        handleAuthClick();
                      }}
                      className="w-full px-4 py-2 text-base font-medium bg-white text-gold-600 hover:bg-gold-50 rounded-full border border-gold-200 shadow-sm flex items-center gap-2 justify-center"
                    >
                      {user ? (
                        <>
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </>
                      ) : (
                        <>
                          <LogIn size={18} />
                          <span>Sign In</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;