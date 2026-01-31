import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
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
    { name: 'Главная', path: '/' },
    { name: 'Галерея', path: '/gallery' },
    { name: 'Калькулятор', path: '/calculator' },
    { name: 'Запись', path: '/booking' },
    { name: 'Кабинет', path: '/dashboard' },
    { name: 'Анимации', path: '/animations' },
  ];

  const handleThemeToggle = () => {
    soundManager.playTone(440, 100, 0.2);
    toggleTheme();
  };

  return (
    <header className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl border-gray-200 dark:border-white/5 py-3'
        : 'bg-white/50 dark:bg-transparent border-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center gap-3 group">
            <AnimatedLogo className="text-gray-900 dark:text-white" />
            <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-gray-900 dark:text-white transition-colors">
              LUXE<span className="text-primary">DETAIL</span>
            </h2>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  location.pathname === link.path 
                    ? 'text-primary dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/50 dark:hover:text-white'
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
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Войти
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/booking" 
              className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded font-black text-[11px] uppercase tracking-[0.15em] hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all"
              onClick={() => soundManager.playTone(600, 100, 0.2)}
            >
              Записаться
            </Link>
          </motion.div>

          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2"
            whileTap={{ scale: 0.95 }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined transition-colors text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white" aria-hidden="true">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: menuOpen ? 1 : 0, height: menuOpen ? 'auto' : 0 }}
        className="lg:hidden overflow-hidden border-t border-gray-200 bg-white/95 dark:border-white/5 dark:bg-background-dark/95"
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-4 px-6 py-4" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ x: 5 }}>
              <Link
                to={link.path}
                className="block text-sm font-bold uppercase tracking-[0.1em] transition-colors text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
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
    <footer className="border-t transition-colors bg-gray-50 border-gray-200 dark:bg-background-dark dark:border-white/10 pt-20 pb-10 px-6 lg:px-12">
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
              <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-gray-900 dark:text-white transition-colors">
                LUXE<span className="text-primary">DETAIL</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-8 text-gray-600 dark:text-white/30 transition-colors">
              The final word in automotive surface preservation. We don't just detail, we re-engineer the aesthetic experience.
            </p>
            <p className={`text-sm leading-relaxed max-w-xs mb-8 ${isDark ? 'text-white/30' : 'text-gray-600'}`}>
              Последнее слово в сохранении автомобильных поверхностей. Мы не просто детейлинг — мы переосмысливаем эстетику.
            </p>
            <div className="flex gap-4">
              {[1, 2].map((i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="size-10 border flex items-center justify-center hover:text-primary transition-all rounded-full border-gray-300 hover:border-primary dark:border-white/10 dark:hover:border-primary"
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
            { title: 'Компания', links: ['Студия', 'Наши работы', 'Цены'] },
            { title: 'Услуги', links: ['Покрытия', 'Коррекция', 'Защита'] },
          ].map((section) => (
            <motion.div key={section.title} className="md:col-span-2" variants={itemVariants}>
              <h6 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-gray-900 dark:text-white transition-colors">
                {section.title}
              </h6>
              <ul className="space-y-4 text-[13px] font-medium">
                {section.links.map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a
                      href="#"
                      className="transition-colors text-gray-600 hover:text-primary dark:text-white/40 dark:hover:text-primary"
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
              Рассылка
            </h6>
            <div className="flex">
              <input
                type="email"
                placeholder="Email адрес"
                className={`rounded-l px-4 py-3 text-sm outline-none focus:border-primary border transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 focus:bg-white/10 text-white'
                    : 'bg-gray-100 border-gray-200 focus:bg-white text-gray-900'
                }`}
              />
              <motion.button
                className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 rounded-r font-black text-[11px] uppercase tracking-widest hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => soundManager.playTone(600, 100, 0.2)}
              >
                Подписаться
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-8 border-gray-200 dark:border-white/5 transition-colors"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
        >
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-white/20' : 'text-gray-500'}`}>
            © 2024 LUXE DETAIL САЛОН. СОЗДАНО ДЛЯ СОВЕРШЕНСТВА.
          </p>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-white/20">
            <motion.a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Конфиденциальность
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              onClick={() => soundManager.playTone(500, 50, 0.15)}
            >
              Условия
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors bg-background-light text-gray-900 dark:bg-background-dark dark:text-white">
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
