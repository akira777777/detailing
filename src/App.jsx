import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { soundManager } from './utils/soundManager';
import Layout from './components/Layout';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AnimationsShowcase = lazy(() => import('./pages/AnimationsShowcase'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white/60 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Инициализация звуков
    soundManager.init();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/animations" element={<AnimationsShowcase />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
