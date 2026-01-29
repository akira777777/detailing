import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
  ];

  return (
    <header className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${scrolled ? 'bg-background-dark/90 backdrop-blur-xl border-white/5 py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-8 bg-white group-hover:bg-primary transition-colors flex items-center justify-center rounded-sm">
            <div className="size-4 bg-black transform rotate-45"></div>
          </div>
          <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-white">LUXE<span className="text-primary">DETAIL</span></h2>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${location.pathname === link.path ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
           <Link to="/dashboard" className="hidden sm:block text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:text-primary transition-all">
                Login
            </Link>
            <Link to="/booking" className="bg-white text-black px-6 py-2.5 rounded font-black text-[11px] uppercase tracking-[0.15em] hover:bg-primary hover:text-white transition-all">
                Book Now
            </Link>
            <span className="lg:hidden material-symbols-outlined text-white/70 cursor-pointer hover:text-white">menu</span>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-background-dark border-t border-white/10 pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-6 bg-primary flex items-center justify-center rounded-sm">
                <div className="size-3 bg-white transform rotate-45"></div>
              </div>
              <h2 className="text-xl font-black tracking-[-0.05em] uppercase text-white">LUXE<span className="text-primary">DETAIL</span></h2>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-8">The final word in automotive surface preservation. We don't just detail, we re-engineer the aesthetic experience.</p>
            <div className="flex gap-4">
                <a href="#" className="size-10 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all rounded-full">
                    <span className="material-symbols-outlined text-lg">share</span>
                </a>
                <a href="#" className="size-10 border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all rounded-full">
                    <span className="material-symbols-outlined text-lg">public</span>
                </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <h6 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Company</h6>
            <ul className="space-y-4 text-[13px] text-white/40 font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">The Studio</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Our Work</Link></li>
              <li><Link to="/calculator" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
             <h6 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Services</h6>
            <ul className="space-y-4 text-[13px] text-white/40 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Coatings</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Correction</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preservation</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
             <h6 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-8">Newsletter</h6>
             <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-l px-4 py-3 text-sm outline-none focus:border-primary w-full text-white" />
                <button className="bg-white text-black px-6 rounded-r font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Join</button>
             </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">© 2024 LUXE DETAIL SALON. BUILT FOR PERFECTION.</p>
            <div className="flex gap-12 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background-dark text-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
