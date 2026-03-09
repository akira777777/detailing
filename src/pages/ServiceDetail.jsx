import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionHeader, Button } from '../components/ui/Components';
import ContactSection from '../components/ContactSection';
import LazyImage from '../components/LazyImage';

const ServiceDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();

    // This would ideally come from a data source or the specialized translation structure
    // For now, mapping IDs to translation keys
    /*
    const serviceKeys = {
        '01': 'ceramic',
        '02': 'interior',
        '03': 'correction'
    };

    const serviceKey = serviceKeys[id] || 'ceramic';
    */
    const validIds = ['01', '02', '03'];

    if (!validIds.includes(id)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark text-center px-6">
                <h1 className="text-4xl font-black mb-4 dark:text-white">Service Not Found</h1>
                <Button as={Link} to="/">Return Home</Button>
            </div>
        );
    }

    // Mock data for images - in a real app this would be in a data file
    const images = {
        '01': 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=2070&auto=format&fit=crop',
        '02': 'https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=2071&auto=format&fit=crop',
        '03': 'https://images.unsplash.com/photo-1597762137731-08f36c641151?q=80&w=2070&auto=format&fit=crop'
    };

    return (
        <div className="pt-20 min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">

            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <LazyImage
                    src={images[id]}
                    alt={t(`home.services.items.${id}.title`)}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center px-6 max-w-4xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary font-bold tracking-[0.3em] uppercase block mb-4"
                        >
                            {t(`home.services.items.${id}.category`)}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8"
                        >
                            {t(`home.services.items.${id}.title`)}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button as={Link} to="/booking">{t('home.hero.book_now')}</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
                        <p className="text-xl leading-relaxed text-gray-600 dark:text-white/70">
                            {t(`home.services.items.${id}.description`)}
                        </p>
                        {/* 
                  Here you would add more detailed content. 
                  Since we don't have deep content yet, we're reusing the description 
                  and adding a placeholder for where detailed lists/benefits would go. 
                */}
                        <div className="my-12 p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border-l-4 border-primary">
                            <h3 className="text-2xl font-bold mb-4 dark:text-white">Why Choose This Service?</h3>
                            <ul className="space-y-3 dark:text-white/70">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <span>Premium materials and equipment</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <span>Certified specialists with years of experience</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    <span>Comprehensive warranty on all work</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <ContactSection />
        </div>
    );
};

export default ServiceDetail;
