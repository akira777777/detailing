import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'ru', label: 'RU' }
    ];

    return (
        <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
            {languages.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`relative px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        aria-label={`Switch language to ${lang.label}`}
                    >
                        <span className="relative z-10">{lang.label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="active-lang"
                                className="absolute inset-0 bg-primary rounded-md shadow-[0_0_10px_rgba(0,145,255,0.4)]"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitcher;
