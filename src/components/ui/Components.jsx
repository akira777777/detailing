import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = "min-w-[220px] flex items-center justify-center h-14 px-10 rounded font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-105 hover:-translate-y-1";

    const variants = {
        primary: "bg-primary text-white hover:bg-white hover:text-black",
        outline: "border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black",
        ghost: "bg-transparent text-white/60 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export const SectionHeader = ({
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
            <h3 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">{title}</h3>
            {description && (
                <p className="text-white/40 max-w-sm text-sm leading-relaxed font-medium">
                    {description}
                </p>
            )}
        </div>
    );
};

export const PageHeader = ({
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
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-[-0.033em] uppercase animate-slide-in-left mb-6">
                {title}
            </h1>
            {description && (
                <p className="text-white/40 text-lg max-w-2xl animate-fade-in-up">
                    {description}
                </p>
            )}
        </div>
    );
}
