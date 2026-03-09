import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LazyImage from '../components/LazyImage';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import { SectionHeader, Button } from '../components/ui/Components';
import { AosReveal } from '../components/ScrollAnimations';
import { useToast } from '../context/ToastContext';

const services = [
  {
    id: "01",
    key: "01",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "02",
    key: "02",
    image: "https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "03",
    key: "03",
    image: "https://images.unsplash.com/photo-1597762137731-08f36c641151?q=80&w=2070&auto=format&fit=crop"
  }
];

const perks = [
  { icon: 'ac_unit', key: '01' },
  { icon: 'analytics', key: '02' },
  { icon: 'smart_toy', key: '03' },
  { icon: 'hub', key: '04' }
];

const Home = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(5,5,5,1)), url('https://images.unsplash.com/photo-1603584173870-7f3ca9940280?q=80&w=2069&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 text-center px-4 max-w-5xl">
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
            <p className="text-white/60 font-bold tracking-[0.5em] uppercase text-[10px] mb-4">{t('home.hero.excellence')}</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-7xl md:text-[110px] font-black leading-[0.9] tracking-tighter mb-10 uppercase"
          >
            {t('home.hero.title_art')}<br /><span className="text-stroke text-glow">{t('home.hero.title_perfection')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/40 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button as={Link} to="/gallery">{t('home.hero.our_services')}</Button>
            <Button as={Link} to="/booking" variant="outline">{t('home.hero.book_now')}</Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-12 left-12 flex flex-col gap-2"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('home.hero.status')}</div>
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

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 right-12"
          aria-hidden="true"
        >
          <span className="material-symbols-outlined text-white/30 text-2xl">south</span>
        </motion.div>
      </section >

      {/* Services Section */}
      < section className="py-32 px-6 lg:px-12 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 transition-colors duration-300" >
        <div className="max-w-[1440px] mx-auto">
          <AosReveal animation="fade-up">
            <SectionHeader
              label={t('home.services.title_label')}
              title={<>{t('home.services.title_main_1')}<br />{t('home.services.title_main_2')}</>}
              description={t('home.services.description')}
              className="mb-24"
            />
          </AosReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {services.map((service, index) => (
              <AosReveal key={service.id} animation="fade-up" delay={index * 100}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/5 p-8 transition-all duration-500 hover:bg-gray-50 dark:hover:bg-white/5 h-[600px] flex flex-col hover:border-primary/50 hover-lift shadow-lg dark:shadow-none"
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-12 group-hover:animate-glow">{service.id} / {t(`home.services.items.${service.key}.category`)}</div>
                      <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{t(`home.services.items.${service.key}.title`)}</h4>
                      <p className="text-gray-600 dark:text-white/40 text-sm leading-relaxed mb-12 group-hover:text-gray-900 dark:group-hover:text-white/60 transition-colors">{t(`home.services.items.${service.key}.description`)}</p>
                    </div>
                    <div className="flex items-center gap-4 text-gray-900 dark:text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                      <Link to={`/services/${service.key}`} className="flex items-center gap-4 group-hover:text-primary transition-colors">
                        <span>{t('home.services.learn_more')}</span>
                        <div className="w-0 group-hover:w-8 h-[1px] bg-primary transition-all duration-500"></div>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">trending_flat</span>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                    <LazyImage alt={t(`home.services.items.${service.key}.title`)} className="w-full h-full object-cover grayscale" src={service.image} />
                  </div>
                </motion.div>
              </AosReveal>
            ))}
          </div>
        </div>
      </section >

      {/* Membership Section */}
      < section className="py-32 px-6 lg:px-12 bg-[#080808] relative overflow-hidden" >
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
                  className="bg-panel-dark border border-primary/20 p-12 relative rounded-xl"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase border border-primary/30 px-3 py-1">{t('home.membership.prestige.limited')}</span>
                  </div>
                  <div className="mb-10">
                    <h4 className="text-3xl font-black uppercase tracking-tight mb-2">{t('home.membership.prestige.title')}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">{t('home.membership.prestige.price')}</span>
                      <span className="text-white/40 text-sm uppercase font-bold tracking-widest">{t('home.membership.prestige.period')}</span>
                    </div>
                  </div>
                  <div className="space-y-6 mb-12">
                    {[
                      "01",
                      "02",
                      "03",
                      "04"
                    ].map((key, i) => (
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
      </section >

      {/* Testimonials Section */}
      < Testimonials />

      {/* Contact Section */}
      < ContactSection />
    </>
  );
};

export default Home;
