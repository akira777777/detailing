import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AosReveal } from './ScrollAnimations';
import { SectionHeader, Button } from './ui/Components';
import { useToast } from '../context/ToastContext';

const ContactSection = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        addToast(t('contact.form.success'), 'success');
        e.target.reset();
    };

    return (
        <section className="py-32 px-6 lg:px-12 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Contact Info */}
                    <AosReveal animation="fade-right">
                        <div>
                            <SectionHeader
                                label={t('contact.subtitle')}
                                title={t('contact.title')}
                                description=""
                                className="mb-12"
                            />

                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2">Location</h5>
                                        <p className="text-xl text-gray-900 dark:text-white font-medium max-w-xs">{t('contact.info.address')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2">Phone</h5>
                                        <p className="text-xl text-gray-900 dark:text-white font-medium">{t('contact.info.phone')}</p>
                                        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{t('contact.info.hours')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2">Email</h5>
                                        <p className="text-xl text-gray-900 dark:text-white font-medium">{t('contact.info.email')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AosReveal>

                    {/* Contact Form */}
                    <AosReveal animation="fade-left">
                        <div className="bg-white dark:bg-panel-dark p-8 md:p-12 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-none">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">{t('contact.form.name')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">{t('contact.form.email')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">{t('contact.form.message')}</label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full justify-center group"
                                >
                                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                                    {!isSubmitting && <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">send</span>}
                                </Button>
                            </form>
                        </div>
                    </AosReveal>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
