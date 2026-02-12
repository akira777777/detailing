import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors px-6">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* 404 Number */}
                    <div className="mb-8">
                        <span className="text-[180px] md:text-[240px] font-black text-primary leading-none tracking-tighter block">
                            404
                        </span>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-white/60 mb-12 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved to another location.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="bg-primary text-white px-8 h-14 rounded font-black uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            Go to Home
                        </Link>
                        <Link
                            to="/calculator"
                            className="border-2 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-8 h-14 rounded font-black uppercase tracking-wider text-sm hover:border-primary hover:text-primary transition-all inline-flex items-center justify-center"
                        >
                            View Services
                        </Link>
                    </div>

                    {/* Decorative Element */}
                    <div className="mt-16 flex items-center gap-3 justify-center text-gray-400 dark:text-white/40">
                        <span className="material-symbols-outlined">info</span>
                        <p className="text-sm font-medium uppercase tracking-wider">Error Code: 404</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
