import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AosReveal } from './ScrollAnimations';
import { SectionHeader } from './ui/Components';

const Testimonials = () => {
    const { t } = useTranslation();

    const testimonials = [
        {
            id: '01',
            key: '01',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'
        },
        {
            id: '02',
            key: '02',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop'
        },
        {
            id: '03',
            key: '03',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop'
        }
    ];

    return (
        <section className="py-32 px-6 lg:px-12 bg-white dark:bg-black transition-colors duration-300 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-3xl rounded-full pointer-events-none transform translate-x-1/2"></div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                <AosReveal animation="fade-up">
                    <SectionHeader
                        label={t('testimonials.subtitle')}
                        title={t('testimonials.title')}
                        description=""
                        className="mb-24 text-center"
                        center
                    />
                </AosReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <AosReveal key={item.id} animation="fade-up" delay={index * 100}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 rounded-2xl relative group h-full hover-lift"
                            >
                                <span className="material-symbols-outlined text-6xl text-primary/20 absolute top-6 right-6 font-serif">format_quote</span>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-14 rounded-full overflow-hidden border-2 border-primary/20">
                                        <img src={item.image} alt={t(`testimonials.items.${item.key}.name`)} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{t(`testimonials.items.${item.key}.name`)}</h4>
                                        <p className="text-primary text-xs font-bold tracking-wider uppercase">{t(`testimonials.items.${item.key}.car`)}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-white/60 leading-relaxed relative z-10 italic">
                                    "{t(`testimonials.items.${item.key}.text`)}"
                                </p>

                                <div className="mt-6 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-primary text-sm">star</span>
                                    ))}
                                </div>
                            </motion.div>
                        </AosReveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
