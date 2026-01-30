import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { soundManager } from './utils/soundManager';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Calculator from './pages/Calculator';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './pages/Dashboard';
import AnimationsShowcase from './pages/AnimationsShowcase';

function App() {
  useEffect(() => {
    // Инициализация AOS
    AOS.init({ duration: 800, once: false });
    // Инициализация звуков
    soundManager.init();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/animations" element={<AnimationsShowcase />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
