import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AnimatedSection from '../components/AnimatedSection';
import { PageHeader } from '../components/ui/Components';
import { transformations } from '../data/mockData';

const Gallery = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('All');

    return (
        <div className="pt-32 pb-24 px-6 lg:px-12 bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto">
                <PageHeader
                    label={t('gallery.label')}
                    title={<>{t('gallery.title').split(' ')[0]}<br />{t('gallery.title').split(' ').slice(1).join(' ')}</>}
                    description={t('gallery.description')}
                />

                <div className="flex flex-wrap gap-3 items-center mb-12 stagger-animation">
                    <span className="text-xs font-bold uppercase text-gray-500 dark:text-white/40 mr-2">{t('gallery.filter_by')}</span>
                    {['All', 'Luxury', 'SUV', 'Correction', 'Protection'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`flex h-9 items-center justify-center gap-x-2 rounded-full border px-6 text-xs font-bold uppercase tracking-wider transition-all ${filter === cat ? 'bg-primary border-primary text-white scale-105 animate-glow' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-primary hover:text-white'}`}
                        >
                            {t(`gallery.filters.${cat.toLowerCase()}`)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-12 stagger-animation">
                    {transformations.map((item, index) => (
                        <AnimatedSection key={item.id} delay={index * 100} className="hover-lift">
                            <div className="group bg-white dark:bg-panel-dark rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all shadow-lg dark:shadow-2xl hover:shadow-[0_0_40px_rgba(0,145,255,0.2)]">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="h-[400px] lg:h-[500px] relative overflow-hidden">
                                        <BeforeAfterSlider beforeImage={item.before} afterImage={item.after} alt={item.title} />
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-4 animate-slide-in-right">
                                                <span className="px-3 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 hover:border-primary/50 transition-all">{t(`gallery.filters.${item.category.toLowerCase()}`)}</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                            <div className="space-y-4 mb-8 stagger-animation">
                                                {item.services.map((service, i) => (
                                                    <div key={i} className="flex items-start gap-3 group/item">
                                                        <span className="material-symbols-outlined text-primary mt-1 text-sm group-hover/item:scale-125 transition-transform">check_circle</span>
                                                        <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{service}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-white/40 mb-1">{t('gallery.total_time')}</span>
                                                <span className="text-gray-900 dark:text-white font-black text-lg animate-pulse-soft">{item.time}</span>
                                            </div>
                                            <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-all hover:gap-4 group/btn">
                                                {t('gallery.case_study')} <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
