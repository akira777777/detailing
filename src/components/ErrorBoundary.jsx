import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors">
                    <div className="max-w-md p-8 bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/10 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                            <div>
                                <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white">Something went wrong</h2>
                                <p className="text-sm text-gray-600 dark:text-white/60 mt-1">We encountered an unexpected error</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-primary text-white h-12 rounded font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-12 rounded font-bold uppercase tracking-wider text-sm hover:border-primary transition-all"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
