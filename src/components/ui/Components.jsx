import React, { memo } from 'react';

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
    const baseStyles = "min-w-[220px] flex items-center justify-center h-14 px-10 rounded font-black uppercase tracking-[0.2em] text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
    const interactionStyles = !isLoading && !disabled ? "hover:scale-105 hover:-translate-y-1" : "";

    const variants = {
        primary: "bg-primary text-white hover:bg-white hover:text-black",
        outline: "border border-gray-200 dark:border-white/20 bg-white/5 backdrop-blur-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white hover:text-black",
        ghost: "bg-transparent text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
    };

    return (
        <ButtonComponent
            className={`${baseStyles} ${interactionStyles} ${variants[variant]} ${className}`}
            onClick={isLoading || disabled ? undefined : onClick}
            disabled={isLoading || disabled}
            aria-busy={isLoading}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </div>
        </ButtonComponent>
    );
});

export const SectionHeader = memo(({
    label,
    title,
    description,
    className = ''
}) => {
    return (
        <div className={`mb-24 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-primary animate-glow"></div>
                <h2 className="text-primary text-[11px] font-black tracking-[0.4em] uppercase">{label}</h2>
            </div>
            <h3 className="text-gray-900 dark:text-white text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 transition-colors">{title}</h3>
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
        <div className={`mb-16 ${className}`}>
             <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs animate-glow mb-4">
                <span className="h-px w-8 bg-primary animate-shimmer"></span>
                {label}
            </div>
            <h1 className="text-gray-900 dark:text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] uppercase animate-slide-in-left mb-6 transition-colors">
                {title}
            </h1>
            {description && (
                <p className="text-gray-600 dark:text-white/40 text-lg max-w-2xl animate-fade-in-up transition-colors">
                    {description}
                </p>
            )}
        </div>
    );
});
