import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Error types enum for categorizing errors
 * @readonly
 * @enum {string}
 */
export const ErrorType = {
  NETWORK: 'network',
  RUNTIME: 'runtime',
  RENDER: 'render',
  UNKNOWN: 'unknown',
  VALIDATION: 'validation',
  TIMEOUT: 'timeout',
};

/**
 * Determines the error type based on error message and properties
 * @param {Error} error - The error object
 * @returns {ErrorType} - The categorized error type
 */
const getErrorType = (error) => {
  if (!error) return ErrorType.UNKNOWN;

  const message = error.message?.toLowerCase() || '';
  const name = error.name?.toLowerCase() || '';

  // Network-related errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('internet') ||
    message.includes('connection') ||
    message.includes('offline') ||
    error.name === 'TypeError' && message.includes('failed to fetch')
  ) {
    return ErrorType.NETWORK;
  }

  // Timeout errors
  if (
    message.includes('timeout') ||
    message.includes('timed out') ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ECONNABORTED'
  ) {
    return ErrorType.TIMEOUT;
  }

  // Validation errors
  if (
    name.includes('validation') ||
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return ErrorType.VALIDATION;
  }

  // React render errors
  if (
    name.includes('render') ||
    message.includes('render') ||
    message.includes('jsx')
  ) {
    return ErrorType.RENDER;
  }

  // Runtime errors
  if (
    name.includes('reference') ||
    name.includes('type') ||
    name.includes('syntax') ||
    name.includes('range')
  ) {
    return ErrorType.RUNTIME;
  }

  return ErrorType.UNKNOWN;
};

/**
 * Error configuration for different error types
 */
const errorConfig = {
  [ErrorType.NETWORK]: {
    icon: '🌐',
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    showRetry: true,
  },
  [ErrorType.TIMEOUT]: {
    icon: '⏱️',
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    showRetry: true,
  },
  [ErrorType.VALIDATION]: {
    icon: '⚠️',
    title: 'Validation Error',
    message: 'There was a problem with the data provided. Please check and try again.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    showRetry: false,
  },
  [ErrorType.RENDER]: {
    icon: '🎨',
    title: 'Render Error',
    message: 'Something went wrong while displaying this content.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    showRetry: true,
  },
  [ErrorType.RUNTIME]: {
    icon: '⚡',
    title: 'Runtime Error',
    message: 'An unexpected error occurred while running the application.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    showRetry: true,
  },
  [ErrorType.UNKNOWN]: {
    icon: '🔧',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    showRetry: true,
  },
};

/**
 * Default fallback UI component for error boundary
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object
 * @param {string} props.errorType - Type of error
 * @param {number} props.retryCount - Number of retry attempts
 * @param {number} props.maxRetries - Maximum number of retry attempts
 * @param {Function} props.onRetry - Retry handler function
 * @param {boolean} props.canRetry - Whether retry is allowed
 * @param {Function} props.onReset - Reset handler function
 */
export const DefaultErrorFallback = ({
  error,
  errorType,
  retryCount,
  maxRetries,
  onRetry,
  canRetry,
  onReset,
}) => {
  const config = errorConfig[errorType] || errorConfig[ErrorType.UNKNOWN];
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-[400px] flex items-center justify-center p-6"
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`max-w-lg w-full rounded-2xl border ${config.borderColor} ${config.bgColor} p-8 text-center backdrop-blur-sm`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-4"
          aria-hidden="true"
        >
          {config.icon}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-2xl font-bold mb-2 ${config.color}`}
        >
          {config.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-white/70 mb-6"
        >
          {config.message}
        </motion.p>

        {canRetry && config.showRetry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={onRetry}
              disabled={retryCount >= maxRetries}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                retryCount >= maxRetries
                  ? 'bg-gray-300 dark:bg-white/10 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
              aria-label={`Retry loading content. Attempt ${retryCount + 1} of ${maxRetries}`}
            >
              {retryCount >= maxRetries ? 'Max Retries Reached' : 'Try Again'}
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white"
              >
                Reset & Continue
              </button>
            )}
          </motion.div>
        )}

        {retryCount > 0 && retryCount < maxRetries && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-gray-500 dark:text-white/50"
          >
            Retry attempt {retryCount} of {maxRetries}
          </motion.p>
        )}

        {process.env.NODE_ENV === 'development' && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-500 dark:text-white/50 underline hover:text-gray-700 dark:hover:text-white/70 transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-gray-900 dark:bg-black/50 rounded-lg text-left overflow-auto max-h-64">
                    <p className="text-red-400 font-mono text-sm mb-2">
                      <strong>Error:</strong> {error.message}
                    </p>
                    <p className="text-gray-400 font-mono text-xs mb-2">
                      <strong>Type:</strong> {errorType}
                    </p>
                    {error.stack && (
                      <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

DefaultErrorFallback.propTypes = {
  error: PropTypes.object,
  errorType: PropTypes.string.isRequired,
  retryCount: PropTypes.number.isRequired,
  maxRetries: PropTypes.number.isRequired,
  onRetry: PropTypes.func.isRequired,
  canRetry: PropTypes.bool.isRequired,
  onReset: PropTypes.func,
};

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI with retry mechanism
 * 
 * @example
 * ```jsx
 * <ErrorBoundary fallback={<ErrorPage />} onError={logError}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: ErrorType.UNKNOWN,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const errorType = getErrorType(error);
    
    this.setState({
      error,
      errorInfo,
      errorType,
    });

    // Log error to monitoring service
    this.logError(error, errorInfo, errorType);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorType);
    }
  }

  /**
   * Logs error details to monitoring service
   * Includes component stack, error info, and metadata
   */
  logError = (error, errorInfo, errorType) => {
    const errorData = {
      timestamp: new Date().toISOString(),
      type: errorType,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Error caught:', errorData);
    }

    // Send to monitoring service if configured
    if (this.props.monitoringService) {
      this.props.monitoringService.captureException(error, {
        extra: errorData,
        tags: { errorType },
      });
    }

    // Send to custom logging endpoint
    if (this.props.logEndpoint) {
      this.sendErrorToEndpoint(errorData);
    }
  };

  /**
   * Sends error data to logging endpoint
   */
  sendErrorToEndpoint = async (errorData) => {
    try {
      await fetch(this.props.logEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });
    } catch (e) {
      // Silent fail - don't create infinite error loops
      if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorBoundary] Failed to send error to endpoint:', e);
      }
    }
  };

  /**
   * Handles retry attempt
   * Increments retry count and resets error state
   */
  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));

      // Call onRetry callback if provided
      if (this.props.onRetry) {
        this.props.onRetry(retryCount + 1);
      }
    }
  };

  /**
   * Resets the error boundary state completely
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: ErrorType.UNKNOWN,
      retryCount: 0,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Check if error is transient (can be retried)
   */
  canRetry = () => {
    const { errorType, retryCount } = this.state;
    const { maxRetries = 3, retryableErrors = [] } = this.props;

    // If specific retryable errors are defined, check against them
    if (retryableErrors.length > 0) {
      return retryableErrors.includes(errorType) && retryCount < maxRetries;
    }

    // Default: network and timeout errors are retryable
    const defaultRetryable = [ErrorType.NETWORK, ErrorType.TIMEOUT];
    return defaultRetryable.includes(errorType) && retryCount < maxRetries;
  };

  render() {
    const { hasError, error, errorType, retryCount } = this.state;
    const { 
      fallback, 
      children, 
      maxRetries = 3,
      FallbackComponent = DefaultErrorFallback,
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use default fallback component
      return (
        <FallbackComponent
          error={error}
          errorType={errorType}
          retryCount={retryCount}
          maxRetries={maxRetries}
          onRetry={this.handleRetry}
          canRetry={this.canRetry()}
          onReset={this.handleReset}
        />
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to render */
  children: PropTypes.node.isRequired,
  /** Custom fallback UI (optional) */
  fallback: PropTypes.node,
  /** Custom fallback component (optional) */
  FallbackComponent: PropTypes.elementType,
  /** Error handler callback */
  onError: PropTypes.func,
  /** Retry callback */
  onRetry: PropTypes.func,
  /** Reset callback */
  onReset: PropTypes.func,
  /** Maximum number of retry attempts (default: 3) */
  maxRetries: PropTypes.number,
  /** List of error types that can be retried */
  retryableErrors: PropTypes.arrayOf(PropTypes.string),
  /** Monitoring service (e.g., Sentry) */
  monitoringService: PropTypes.shape({
    captureException: PropTypes.func.isRequired,
  }),
  /** Endpoint URL for error logging */
  logEndpoint: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  maxRetries: 3,
  retryableErrors: [],
};

export default ErrorBoundary;

/**
 * Higher-Order Component for wrapping components with ErrorBoundary
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} errorBoundaryProps - Props for ErrorBoundary
 * @returns {React.Component} - Wrapped component
 * 
 * @example
 * ```jsx
 * export default withErrorBoundary(MyComponent, {
 *   onError: (error) => console.error(error),
 *   maxRetries: 3
 * });
 * ```
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithErrorBoundary;
};

/**
 * Hook to trigger error boundary from functional components
 * @returns {Function} - Function to throw error to boundary
 * 
 * @example
 * ```jsx
 * const triggerError = useErrorBoundary();
 * 
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   triggerError(error);
 * }
 * ```
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState(null);

  if (error) {
    throw error;
  }

  return setError;
};
