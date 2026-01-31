import React, { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const ToastItem = ({ id, message, type, duration, removeToast }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, removeToast]);

    const bgColors = {
        info: 'bg-[#1e1e1e] border-blue-500/50',
        success: 'bg-[#1e1e1e] border-green-500/50',
        error: 'bg-[#1e1e1e] border-red-500/50',
        warning: 'bg-[#1e1e1e] border-yellow-500/50'
    };

    const iconColors = {
        info: 'text-blue-500',
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500'
    };

    const icons = {
        info: 'info',
        success: 'check_circle',
        error: 'error',
        warning: 'warning'
    };

    return (
        <motion.div
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] border backdrop-blur-md`}
            layout
        >
            <span className={`material-symbols-outlined text-xl ${iconColors[type]}`} aria-hidden="true">{icons[type]}</span>
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={() => removeToast(id)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
                aria-label="Close notification"
            >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
            </button>
        </motion.div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem {...toast} removeToast={removeToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
