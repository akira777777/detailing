import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// BMW Images - High quality from Unsplash
const BMW_IMAGES = {
  exterior: [
    {
      id: 'front-angle',
      url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80',
      title: 'BMW Front View',
      description: 'Dynamic front 3/4 angle showcasing the iconic kidney grille',
      category: 'Exterior'
    },
    {
      id: 'side-profile',
      url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1920&q=80',
      title: 'BMW Side Profile',
      description: 'Elegant silhouette with perfect proportions',
      category: 'Exterior'
    },
    {
      id: 'rear-angle',
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80',
      title: 'BMW Rear View',
      description: 'Powerful rear stance with signature L-shaped taillights',
      category: 'Exterior'
    }
  ],
  interior: [
    {
      id: 'dashboard',
      url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1920&q=80',
      title: 'BMW Dashboard',
      description: 'Driver-focused cockpit with digital displays',
      category: 'Interior'
    },
    {
      id: 'steering-wheel',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
      title: 'BMW Steering Wheel',
      description: 'Premium leather-wrapped steering wheel with controls',
      category: 'Interior'
    },
    {
      id: 'leather-seats',
      url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&q=80',
      title: 'BMW Leather Seats',
      description: 'Handcrafted Merino leather upholstery',
      category: 'Interior'
    }
  ]
};

// Animated SVG Icons
const AnimatedIcon = ({ name, className = '', size = 24 }) => {
  const icons = {
    car: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <motion.path
          d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-5.4a2 2 0 0 0-1.8-1.1H10.5a2 2 0 0 0-1.8 1.1L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    droplet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <motion.path
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <motion.path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    ),
    sparkle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <motion.path
          d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <motion.polyline
          points="12 6 12 12 16 14"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <motion.polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
    )
  };

  return icons[name] || null;
};

// Badge Component
const Badge = ({ children, variant = 'default', animated = true }) => {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    premium: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-400',
    luxury: 'bg-gradient-to-r from-primary to-cyan-400 text-white border-primary',
    exclusive: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400'
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm z-10 ${variants[variant]}`}
      style={{
        animation: animated ? 'float 3s ease-in-out infinite' : 'none'
      }}
    >
      {children}
    </motion.span>
  );
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

// Image Card Component
const ImageCard = ({ image, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard className="overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* Image */}
          <motion.img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)'
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Glassmorphism Overlay on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-[2px]"
              />
            )}
          </AnimatePresence>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                <AnimatedIcon name={image.category === 'Exterior' ? 'car' : 'sparkle'} size={12} />
                {image.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-1">{image.title}</h3>
              <p className="text-sm text-white/60">{image.description}</p>
            </motion.div>
          </div>
          
          {/* Hover Zoom Indicator */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <span className="material-symbols-outlined text-white text-2xl">zoom_in</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
      
      {/* Badge */}
      {index === 0 && <Badge variant="premium">Featured</Badge>}
      {index === 2 && <Badge variant="luxury">Popular</Badge>}
    </motion.div>
  );
};

// Stats Bar Component
const StatsBar = () => {
  const { t } = useTranslation();
  
  const stats = [
    { value: '500+', label: t('gallery.stats.clients', 'Happy Clients'), icon: 'star' },
    { value: '10+', label: t('gallery.stats.experience', 'Years Experience'), icon: 'clock' },
    { value: '99%', label: t('gallery.stats.satisfaction', 'Satisfaction'), icon: 'shield' },
    { value: '2000+', label: t('gallery.stats.cars', 'Cars Detailed'), icon: 'car' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6 text-center hover:border-primary/30 transition-colors">
            <AnimatedIcon name={stat.icon} size={28} className="text-primary mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">{stat.label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

// Main BMW Gallery Component
const BMWGallery = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  const allImages = [...BMW_IMAGES.exterior, ...BMW_IMAGES.interior];
  
  const filteredImages = activeTab === 'all' 
    ? allImages 
    : allImages.filter(img => img.category.toLowerCase() === activeTab);

  return (
    <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <AnimatedIcon name="sparkle" size={14} />
            {t('gallery.badge', 'Premium Showcase')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
            {t('gallery.title', 'BMW')} <span className="text-gradient">{t('gallery.title_highlight', 'Gallery')}</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            {t('gallery.description', 'Explore our premium detailing work on BMW vehicles. Every angle showcases our commitment to perfection.')}
          </p>
        </motion.div>

        {/* Stats */}
        <StatsBar />

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {['all', 'exterior', 'interior'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t(`gallery.filter.${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <GlassCard className="inline-flex flex-col sm:flex-row items-center gap-6 p-8">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">{t('gallery.cta.title', 'Ready to transform your BMW?')}</h3>
              <p className="text-white/50 text-sm">{t('gallery.cta.subtitle', 'Book your premium detailing session today')}</p>
            </div>
            <motion.a
              href="/booking"
              className="px-8 py-4 bg-gradient-to-r from-primary to-cyan-400 text-white font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('gallery.cta.button', 'Book Now')}
            </motion.a>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default BMWGallery;
