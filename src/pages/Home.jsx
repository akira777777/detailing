import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import LazyImage from '../components/LazyImage';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import BMWGallery from '../components/BMWGallery';
import { SectionHeader, Button } from '../components/ui/Components';
import { AosReveal } from '../components/ScrollAnimations';
import { useToast } from '../context/ToastContext';

// Services data - updated for detailing services
const services = [
  {
    id: "01",
    key: "01",
    icon: "directions_car",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "02",
    key: "02",
    icon: "airline_seat_recline_extra",
    image: "https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "03",
    key: "03",
    icon: "auto_fix_high",
    image: "https://images.unsplash.com/photo-1597762137731-08f36c641151?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "04",
    key: "04",
    icon: "shield",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "05",
    key: "05",
    icon: "layers",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
  }
];

// Stats data
const stats = [
  { value: '500+', labelKey: 'home.stats.clients', icon: 'groups' },
  { value: '10+', labelKey: 'home.stats.experience', icon: 'calendar_today' },
  { value: '99%', labelKey: 'home.stats.satisfaction', icon: 'star' },
  { value: '2000+', labelKey: 'home.stats.cars', icon: 'directions_car' }
];

// Perks data
const perks = [
  { icon: 'ac_unit', key: '01' },
  { icon: 'analytics', key: '02' },
  { icon: 'smart_toy', key: '03' },
  { icon: 'hub', key: '04' }
];

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = React.useState('0');
  
  React.useEffect(() => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    let startTime;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const currentValue = Math.floor(progress * numericValue);
      setDisplayValue(currentValue + suffix);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
};

// Glass Card Component
const GlassCard = ({ children, className = '' }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    ${className}
  `}>
    {children}
  </div>
);

const Home = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const heroRef = useRef(null);
  
  // Parallax scrolling
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const textY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <>
      {/* Hero Section with Parallax - AutoFix Style */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(10,10,10,0.95)), url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop')" }}
          />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </motion.div>
        
        {/* Hero Content */}
        <motion.div 
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-32 h-0.5 bg-white/10 mb-8 relative overflow-hidden">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 h-full w-1/2 bg-primary"
              />
            </div>
            <p className="text-white/60 font-bold tracking-[0.5em] uppercase text-[10px] mb-4">{t('home.hero.excellence', 'Premium Automotive Care')}</p>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 uppercase"
          >
            <span className="block">{t('home.hero.title_art', 'Professional Car')}</span>
            <span className="text-gradient bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">{t('home.hero.title_perfection', 'Detailing')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/50 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.hero.subtitle', 'Premium detailing services featuring precision paint correction, ceramic coating, and interior detailing. Experience the ultimate in automotive care.')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button as={Link} to="/booking">{t('home.hero.book_now', 'Book Now')}</Button>
            <Button as={Link} to="/gallery" variant="outline">{t('home.hero.our_services', 'Our Services')}</Button>
          </motion.div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12 left-12 flex flex-col gap-2"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('home.hero.status', 'Status')}</div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-[1px] bg-white/10 relative">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-0 h-full w-2/3 bg-primary shadow-[0_0_8px_#0091FF]"
              />
            </div>
            <span className="text-[10px] font-bold text-primary tracking-tighter animate-pulse-soft">01 / 04</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 right-12"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined text-white/30 text-2xl">south</span>
        </motion.div>
      </section>

      {/* Stats Section - AutoFix Style */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-black to-[#0a0a0a] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center hover:border-primary/30 transition-all duration-300 group">
                  <motion.span
                    className="material-symbols-outlined text-primary text-3xl mb-4 block group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    {stat.icon}
                  </motion.span>
                  <div className="text-4xl font-black text-white mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    {t(stat.labelKey)}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - AutoFix Style */}
      <section className="py-32 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <AosReveal animation="fade-up">
            <SectionHeader
              label={t('home.services.title_label', 'Core Services')}
              title={<>{t('home.services.title_main_1', 'Our Standout')}<br />{t('home.services.title_main_2', 'Services')}</>}
              description={t('home.services.description', 'Professional detailing services tailored to your vehicle\'s needs')}
              className="mb-24"
            />
          </AosReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AosReveal key={service.id} animation="fade-up" delay={index * 100}>
                <motion.div
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 145, 255, 0.15)" }}
                  className="group relative overflow-hidden bg-white/[0.02] border border-white/5 p-8 transition-all duration-500 hover:bg-white/[0.05] min-h-[400px] flex flex-col hover:border-primary/30 rounded-2xl"
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Service Number */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl font-black text-white/10 group-hover:text-primary/20 transition-colors">{service.id}</span>
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className="material-symbols-outlined text-primary text-2xl"
                        >
                          {service.icon}
                        </motion.span>
                      </div>
                      
                      {/* Service Title */}
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-4 text-white group-hover:text-primary transition-colors">
                        {t(`home.services.items.${service.key}.title`)}
                      </h4>
                      
                      {/* Service Description */}
                      <p className="text-white/40 text-sm leading-relaxed mb-8 group-hover:text-white/60 transition-colors">
                        {t(`home.services.items.${service.key}.description`)}
                      </p>
                    </div>
                    
                    {/* Learn More Link */}
                    <div className="flex items-center gap-4 text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                      <Link to={`/services/${service.key}`} className="flex items-center gap-4 group-hover:text-primary transition-colors">
                        <span>{t('home.services.learn_more', 'Learn More')}</span>
                        <div className="w-0 group-hover:w-8 h-[1px] bg-primary transition-all duration-500"></div>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">trending_flat</span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Background Image on Hover */}
                  <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                    <LazyImage alt={t(`home.services.items.${service.key}.title`)} className="w-full h-full object-cover" src={service.image} />
                  </div>
                </motion.div>
              </AosReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BMW Gallery Section */}
      <BMWGallery />

      {/* About Section - AutoFix Style */}
      <section className="py-32 px-6 lg:px-12 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlassCard className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1920&auto=format&fit=crop"
                    alt="BMW Detailing"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </GlassCard>
              
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary to-cyan-400 text-white px-6 py-4 rounded-xl shadow-lg shadow-primary/30"
              >
                <div className="text-3xl font-black">10+</div>
                <div className="text-xs uppercase tracking-wider opacity-80">Years Experience</div>
              </motion.div>
            </motion.div>
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-[11px] font-black tracking-[0.5em] uppercase mb-6 block">About Us</span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                {t('home.about.title', 'Our Detailing Story')}
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                {t('home.about.description', 'At DETAILING SALON LUX, we are passionate about bringing out the best in every vehicle. Our team of skilled professionals uses only the finest products and techniques to deliver exceptional results.')}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { icon: 'verified', text: t('home.about.feature1', 'Certified Experts') },
                  { icon: 'eco', text: t('home.about.feature2', 'Eco-Friendly Products') },
                  { icon: 'speed', text: t('home.about.feature3', 'Fast Service') },
                  { icon: 'workspace_premium', text: t('home.about.feature4', 'Premium Quality') }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                    <span className="text-white/70 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <Button as={Link} to="/about">{t('home.about.cta', 'Learn More')}</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-32 px-6 lg:px-12 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-[1440px] mx-auto">
          <AosReveal animation="fade-up" className="text-center mb-24">
            <h2 className="text-primary text-[11px] font-black tracking-[0.5em] uppercase mb-6 animate-glow">{t('home.membership.club')}</h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">{t('home.membership.title')}</h3>
            <p className="text-white/40 max-w-xl mx-auto font-medium text-sm">{t('home.membership.description')}</p>
          </AosReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
              {perks.map((perk, index) => (
                <AosReveal key={perk.title} animation="fade-up" delay={index * 100}>
                  <div className="space-y-4 hover-lift group">
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="material-symbols-outlined text-primary text-3xl block"
                    >
                      {perk.icon}
                    </motion.span>
                    <h5 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors">{t(`home.membership.perks.${perk.key}.title`)}</h5>
                    <p className="text-white/40 text-[13px] leading-relaxed">{t(`home.membership.perks.${perk.key}.desc`)}</p>
                  </div>
                </AosReveal>
              ))}
            </div>

            <div className="lg:col-span-5">
              <AosReveal animation="fade-left">
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 0 30px rgba(0, 145, 255, 0.2)" }}
                  className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-12 relative rounded-2xl"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase border border-primary/30 px-3 py-1 rounded-full">{t('home.membership.prestige.limited')}</span>
                  </div>
                  <div className="mb-10">
                    <h4 className="text-3xl font-black uppercase tracking-tight mb-2">{t('home.membership.prestige.title')}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{t('home.membership.prestige.price')}</span>
                      <span className="text-white/40 text-sm uppercase font-bold tracking-widest">{t('home.membership.prestige.period')}</span>
                    </div>
                  </div>
                  <div className="space-y-6 mb-12">
                    {["01", "02", "03", "04"].map((key, i) => (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="size-2 rounded-full bg-primary group-hover/item:scale-150 transition-transform"></div>
                        <span className="text-sm font-medium text-white/70 group-hover/item:text-white transition-colors">{t(`home.membership.prestige.features.${key}`)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-white text-black hover:bg-primary hover:text-white"
                    onClick={() => addToast(t('home.membership.prestige.invitation_sent'), 'success')}
                  >
                    {t('home.membership.prestige.request_invitation')}
                  </Button>
                  <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{t('home.membership.prestige.available_spots')}</span>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                          className="size-1 bg-primary"
                        />
                      ))}
                      <div className="size-1 bg-white/10"></div>
                    </div>
                  </div>
                </motion.div>
              </AosReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <ContactSection />
    </>
  );
};

export default Home;
