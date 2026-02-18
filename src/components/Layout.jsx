import { useState, useCallback, memo, useMemo } from 'react';
import { Link, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';
import { AnimatedLogo } from './AnimatedIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { soundManager } from '../utils/soundManager';

// Optimization: Static navigation data moved outside component to prevent recreation on every render
const NAV_LINKS = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.gallery', path: '/gallery' },
  { key: 'nav.calculator', path: '/calculator' },
  { key: 'nav.booking', path: '/booking' },
  { key: 'nav.dashboard', path: '/dashboard' },
  { key: 'nav.animations', path: '/animations' },
];

// Optimization: Static footer sections moved outside to prevent recreation
const FOOTER_SECTIONS = [
  { title: 'footer.company', links: ['footer.links.studio', 'footer.links.our_work', 'footer.links.pricing'] },
  { title: 'footer.services', links: ['footer.links.coatings', 'footer.links.correction', 'footer.links.protection'] },
];

// Optimization: Static variants moved outside component
const FOOTER_VARIANTS = {
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

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Optimization: Memoized NavLink component to prevent unnecessary re-renders
const NavLink = memo(({ link, onClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="relative py-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RouterNavLink
        to={link.path}
        className={({ isActive }) => `text-xs font-semibold uppercase tracking-widest transition-colors ${isActive
          ? 'text-primary'
          : 'text-white/70 hover:text-white'
          }`}
        onClick={onClick}
        aria-current={({ isActive }) => isActive ? 'page' : undefined}
      >
        {t(link.key)}
      </RouterNavLink>
      <NavLinkIndicator path={link.path} />
    </motion.div>
  );
});

NavLink.displayName = 'NavLink';

// Separate indicator component for better performance
const NavLinkIndicator = memo(({ path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  if (!isActive) return null;

  return (
    <motion.div
      layoutId="active-nav-link"
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,145,255,0.5)]"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
});

NavLinkIndicator.displayName = 'NavLinkIndicator';

// Optimization: Memoized MobileNavLink component
const MobileNavLink = memo(({ link, index, onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      key={link.key}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
    >
      <Link
        to={link.path}
        className="block text-sm font-bold uppercase tracking-[0.1em] transition-colors text-white/70 hover:text-white"
        onClick={onClick}
      >
        {t(link.key)}
      </Link>
    </motion.div>
  );
});

MobileNavLink.displayName = 'MobileNavLink';

// Navbar component
const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Optimization: Use framer-motion's useScroll for throttled scroll handling
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 50;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  });

  // Optimization: useCallback with stable references
  const handleThemeToggle = useCallback(() => {
    soundManager.playTone(440, 100, 0.2);
    toggleTheme();
  }, [toggleTheme]);

  const handleLinkClick = useCallback((name) => {
    if (name === 'MobileMenu') {
      setMenuOpen(prev => !prev);
    } else {
      setMenuOpen(false);
    }
    soundManager.playTone(500, 50, 0.15);
  }, []);

  // Optimization: Memoized click handler for links to prevent recreation
  const handleNavLinkClick = useCallback(() => {
    soundManager.playTone(500, 50, 0.15);
  }, []);

  // Optimization: Memoized mobile link click handler
  const handleMobileLinkClick = useCallback(() => {
    setMenuOpen(false);
    soundManager.playTone(500, 50, 0.15);
  }, []);

  // Optimization: Memoized click handler for booking link
  const handleBookingClick = useCallback(() => {
    soundManager.playTone(600, 100, 0.2);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
      ? 'bg-black/95 backdrop-blur-lg border-b border-white/10 py-4'
      : 'bg-transparent py-6'
      }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center gap-3 group">
            <AnimatedLogo className="text-gray-900 dark:text-white" />
            <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-white">
              DETAILING SALON <span className="text-primary">LUX</span>
            </h2>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation" role="navigation">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.key}
              link={link}
              onClick={handleNavLinkClick}
            />
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          {/* Theme Toggle */}
          <motion.button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white"
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard"
              className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.15em] transition-colors text-gray-600 hover:text-primary dark:text-white dark:hover:text-primary"
              onClick={handleNavLinkClick}
            >
              {t('nav.login')}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/booking"
              className="bg-primary text-white px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/30"
              onClick={handleBookingClick}
            >
              {t('nav.book_now')}
            </Link>
          </motion.div>

          <motion.button
            onClick={() => handleLinkClick('MobileMenu')}
            className="lg:hidden p-2"
            whileTap={{ scale: 0.95 }}
            aria-label={menuOpen ? t('nav.mobile_menu_close') : t('nav.mobile_menu_open')}
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined transition-colors text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white" aria-hidden="true">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-lg"
            aria-hidden={!menuOpen}
          >
            <nav className="flex flex-col gap-4 px-6 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, index) => (
                <MobileNavLink
                  key={link.key}
                  link={link}
                  index={index}
                  onClick={handleMobileLinkClick}
                />
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Footer component
const Footer = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Optimization: Memoize footer sections to prevent recreation on every render
  const footerSections = useMemo(() => FOOTER_SECTIONS, []);

  // Optimization: Memoized click handler for footer links
  const handleFooterLinkClick = useCallback(() => {
    soundManager.playTone(500, 50, 0.15);
  }, []);

  // Optimization: Memoized newsletter button click
  const handleNewsletterClick = useCallback(() => {
    soundManager.playTone(600, 100, 0.2);
  }, []);

  // Optimization: Memoized click handler for social links
  const handleSocialClick = useCallback(() => {
    soundManager.playTone(500, 50, 0.15);
  }, []);

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20"
          variants={FOOTER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div className="md:col-span-4" variants={ITEM_VARIANTS}>
            <div className="flex items-center gap-4 mb-8">
              <div className="size-6 bg-primary flex items-center justify-center rounded-sm">
                <div className="size-3 bg-white transform rotate-45"></div>
              </div>
              <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-white">
                DETAILING SALON <span className="text-primary">LUX</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-8 text-gray-600 dark:text-white/30 transition-colors">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="size-10 border flex items-center justify-center hover:text-primary transition-all rounded-full border-gray-300 hover:border-primary dark:border-white/10 dark:hover:border-primary"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSocialClick}
                >
                  <span className="material-symbols-outlined text-lg">
                    {i === 1 ? 'share' : 'public'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section) => (
            <motion.div key={section.title} className="md:col-span-2" variants={ITEM_VARIANTS}>
              <h6 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-gray-900 dark:text-white transition-colors">
                {t(section.title)}
              </h6>
              <ul className="space-y-4 text-[13px] font-medium">
                {section.links.map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="transition-colors text-gray-600 hover:text-primary dark:text-white/40 dark:hover:text-primary"
                      onClick={handleFooterLinkClick}
                    >
                      {t(link)}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div className="md:col-span-4" variants={ITEM_VARIANTS}>
            <h6 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('footer.newsletter')}
            </h6>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.newsletter_placeholder')}
                className={`rounded-l px-4 py-3 text-sm outline-none focus:border-primary border transition-colors ${isDark
                  ? 'bg-white/5 border-white/10 focus:bg-white/10 text-white'
                  : 'bg-gray-100 border-gray-200 focus:bg-white text-gray-900'
                  }`}
              />
              <motion.button
                className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 rounded-r font-black text-[11px] uppercase tracking-widest hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewsletterClick}
              >
                {t('footer.subscribe')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-8 border-gray-200 dark:border-white/5 transition-colors"
          variants={ITEM_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          <div className="flex flex-col gap-2">
            <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/20' : 'text-gray-500'}`}>
              {t('footer.copyright')}
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">
              dev: Artem Mikhailov
            </p>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-white/20">
            <motion.a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={handleSocialClick}
            >
              {t('footer.privacy')}
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={handleSocialClick}
            >
              {t('footer.terms')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Memoized Navbar to prevent unnecessary re-renders
const MemoizedNavbar = memo(Navbar);

// Memoized Footer to prevent unnecessary re-renders
const MemoizedFooter = memo(Footer);

const Layout = ({ children }) => {
  const { t } = useTranslation();

  // Optimization: Memoize children rendering is handled by React.memo on Layout
  return (
    <div className="min-h-screen flex flex-col font-sans bg-black text-white">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        {t('skip_to_main')}
      </a>
      <MemoizedNavbar />
      <motion.main
        id="main-content"
        className="flex-grow outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        tabIndex={-1}
      >
        {children}
      </motion.main>
      <MemoizedFooter />
    </div>
  );
};

// Memoized Layout to prevent unnecessary re-renders when children haven't changed
export default memo(Layout);

// PropTypes for type checking
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

NavLink.propTypes = {
  link: PropTypes.shape({
    key: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

NavLinkIndicator.propTypes = {
  path: PropTypes.string.isRequired,
};

MobileNavLink.propTypes = {
  link: PropTypes.shape({
    key: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};
