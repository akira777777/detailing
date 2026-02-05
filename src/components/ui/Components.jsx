import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const Button = memo(({
    children,
    variant = 'primary',
    className = '',
    onClick,
    isLoading = false,
    disabled = false,
    // eslint-disable-next-line no-unused-vars
    as: ButtonComponent = 'button',
    ...props
}) => {
    const baseStyles = "min-w-[220px] flex items-center justify-center h-14 px-10 rounded font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none";
    const interactionStyles = !isLoading && !disabled ? "hover:scale-105 hover:-translate-y-1 active:scale-95" : "";

    const variants = {
        primary: "bg-primary text-white hover:bg-white hover:text-black shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        outline: "border-2 border-gray-200 dark:border-white/20 bg-white/5 backdrop-blur-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white hover:text-black hover:border-primary",
        ghost: "bg-transparent text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
    };

    return (
        <ButtonComponent
            className={`${baseStyles} ${interactionStyles} ${variants[variant]} ${className}`}
            onClick={isLoading || disabled ? undefined : onClick}
            disabled={isLoading || disabled}
            aria-busy={isLoading}
            aria-disabled={disabled}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <svg 
                        className="animate-spin h-4 w-4" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </div>
        </ButtonComponent>
    );
});

export const IconButton = memo(({
    children,
    onClick,
    className = '',
    disabled = false,
    ariaLabel,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`
                p-3 rounded-lg transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20
                text-gray-900 dark:text-white
                ${className}
            `}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </motion.button>
    );
});

export const SectionHeader = memo(({
    label,
    title,
    description,
    className = ''
}) => {
    return (
        <div className={`mb-16 md:mb-24 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <motion.div 
                    className="w-8 h-[1px] bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: 32 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                />
                <h2 className="text-primary text-[11px] font-black tracking-[0.4em] uppercase">{label}</h2>
            </div>
            <h3 className="text-gray-900 dark:text-white text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6 md:mb-8 transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-gray-600 dark:text-white/40 max-w-sm text-sm leading-relaxed font-medium transition-colors">
                    {description}
                </p>
            )}
        </div>
    );
});

export const PageHeader = memo(({
    label,
    title,
    description,
    className = ''
}) => {
    return (
        <div className={`mb-12 md:mb-16 ${className}`}>
             <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-4">
                <motion.span 
                    className="h-px bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: 32 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                />
                {label}
            </div>
            <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-[-0.033em] uppercase mb-4 md:mb-6 transition-colors">
                {title}
            </h1>
            {description && (
                <p className="text-gray-600 dark:text-white/40 text-base md:text-lg max-w-2xl transition-colors">
                    {description}
                </p>
            )}
        </div>
    );
});

export const Card = memo(({
    children,
    className = '',
    hover = true,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
            className={`
                bg-white dark:bg-panel-dark 
                border border-gray-200 dark:border-white/10 
                rounded-xl overflow-hidden
                transition-shadow duration-300
                ${hover ? 'hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
});

export const Badge = memo(({
    children,
    variant = 'primary',
    className = ''
}) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <span className={`
            px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
            border ${variants[variant]} ${className}
        `}>
            {children}
        </span>
    );
});
