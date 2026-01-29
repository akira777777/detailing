import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { AnimatedLogo } from './AnimatedIcons';
import { soundManager } from '../utils/soundManager';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Booking', path: '/booking' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Animations', path: '/animations' },
  ];

  const handleThemeToggle = () => {
    soundManager.playTone(440, 100, 0.2);
    toggleTheme();
  };

  return (
    <header className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      scrolled 
        ? isDark 
          ? 'bg-background-dark/90 backdrop-blur-xl border-white/5 py-3' 
          : 'bg-white/90 backdrop-blur-xl border-gray-200 py-3'
        : isDark
          ? 'bg-transparent border-transparent py-5'
          : 'bg-white/50 border-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center gap-3 group">
            <AnimatedLogo className={`${isDark ? 'text-white' : 'text-gray-900'}`} />
            <h2 className={`text-xl font-black tracking-[-0.05em] uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
              LUXE<span className="text-primary">DETAIL</span>
            </h2>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : isDark
                      ? 'text-white/50 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => soundManager.playTone(500, 50, 0.15)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <motion.button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/dashboard" 
              className={`hidden sm:block text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${isDark ? 'text-white hover:text-primary' : 'text-gray-600 hover:text-primary'}`}
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/booking" 
              className="bg-white dark:bg-white text-black px-6 py-2.5 rounded font-black text-[11px] uppercase tracking-[0.15em] hover:bg-primary hover:text-white transition-all"
              onClick={() => soundManager.playTone(600, 100, 0.2)}
            >
              Book Now
            </Link>
          </motion.div>

          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2"
            whileTap={{ scale: 0.95 }}
          >
            <span className={`material-symbols-outlined transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              {menuOpen ? 'close' : 'menu'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: menuOpen ? 1 : 0, height: menuOpen ? 'auto' : 0 }}
        className={`lg:hidden overflow-hidden border-t ${isDark ? 'border-white/5 bg-background-dark/95' : 'border-gray-200 bg-white/95'}`}
      >
        <nav className="flex flex-col gap-4 px-6 py-4">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ x: 5 }}>
              <Link
                to={link.path}
                className={`block text-sm font-bold uppercase tracking-[0.1em] transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => {
                  setMenuOpen(false);
                  soundManager.playTone(500, 50, 0.15);
                }}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </header>
  );
};

const Footer = () => {
  const { isDark } = useTheme();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className={`border-t transition-colors ${isDark ? 'bg-background-dark border-white/10' : 'bg-gray-50 border-gray-200'} pt-20 pb-10 px-6 lg:px-12`}>
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div className="md:col-span-4" variants={itemVariants}>
            <div className="flex items-center gap-4 mb-8">
              <div className="size-6 bg-primary flex items-center justify-center rounded-sm">
                <div className="size-3 bg-white transform rotate-45"></div>
              </div>
              <h2 className={`text-xl font-black tracking-[-0.05em] uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
                LUXE<span className="text-primary">DETAIL</span>
              </h2>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs mb-8 ${isDark ? 'text-white/30' : 'text-gray-600'}`}>
              The final word in automotive surface preservation. We don't just detail, we re-engineer the aesthetic experience.
            </p>
            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <motion.a
                  key={i}
                  href="#"
                  className={`size-10 border flex items-center justify-center hover:text-primary transition-all rounded-full ${
                    isDark 
                      ? 'border-white/10 hover:border-primary' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => soundManager.playTone(500, 50, 0.15)}
                >
                  <span className="material-symbols-outlined text-lg">
                    {i === 1 ? 'share' : 'public'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {[
            { title: 'Company', links: ['The Studio', 'Our Work', 'Pricing'] },
            { title: 'Services', links: ['Coatings', 'Correction', 'Preservation'] },
          ].map((section) => (
            <motion.div key={section.title} className="md:col-span-2" variants={itemVariants}>
              <h6 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h6>
              <ul className="space-y-4 text-[13px] font-medium">
                {section.links.map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className={`transition-colors ${isDark ? 'text-white/40 hover:text-primary' : 'text-gray-600 hover:text-primary'}`}
                      onClick={() => soundManager.playTone(500, 50, 0.15)}
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div className="md:col-span-4" variants={itemVariants}>
            <h6 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Newsletter
            </h6>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className={`rounded-l px-4 py-3 text-sm outline-none focus:border-primary border transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 focus:bg-white/10 text-white'
                    : 'bg-gray-100 border-gray-200 focus:bg-white text-gray-900'
                }`}
              />
              <motion.button
                className="bg-white text-black px-6 rounded-r font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => soundManager.playTone(600, 100, 0.2)}
              >
                Join
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-8 ${isDark ? 'border-white/5' : 'border-gray-200'}`}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/20' : 'text-gray-500'}`}>
            © 2024 LUXE DETAIL SALON. BUILT FOR PERFECTION.
          </p>
          <div className={`flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/20' : 'text-gray-500'}`}>
            <motion.a
              href="#"
              className="hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Terms
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDark ? 'bg-background-dark text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
