import React, { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { soundManager } from './utils/soundManager';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AnimationsShowcase = lazy(() => import('./pages/AnimationsShowcase'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-white/60 text-sm font-medium">{t('loading')}</p>
      </div>
    </div>
  );
};

// AnimatedRoutes component to handle the AnimatePresence logic
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/calculator" element={<PageTransition><Calculator /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/booking-confirmation" element={<PageTransition><BookingConfirmation /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/animations" element={<PageTransition><AnimationsShowcase /></PageTransition>} />
        <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    // Initialize sounds
    soundManager.init();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </ErrorBoundary>
          </Layout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
