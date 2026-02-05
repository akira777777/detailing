// Logging utilities with different levels and transports

import fs from 'fs';
import path from 'path';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

class Logger {
  constructor(serviceName = 'app') {
    this.serviceName = serviceName;
    this.logDir = path.join(process.cwd(), 'logs');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Setup log files
    this.setupLogFiles();
  }

  setupLogFiles() {
    const date = new Date().toISOString().split('T')[0];
    this.accessLog = fs.createWriteStream(
      path.join(this.logDir, `access-${date}.log`), 
      { flags: 'a' }
    );
    this.errorLog = fs.createWriteStream(
      path.join(this.logDir, `error-${date}.log`), 
      { flags: 'a' }
    );
    this.appLog = fs.createWriteStream(
      path.join(this.logDir, `app-${date}.log`), 
      { flags: 'a' }
    );
  }

  formatLog(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...meta
    });
  }

  log(level, message, meta = {}) {
    if (LOG_LEVELS[level] > CURRENT_LEVEL) return;

    const logEntry = this.formatLog(level, message, meta);
    
    // Console output
    const consoleColors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[35m'  // Magenta
    };
    
    const resetColor = '\x1b[0m';
    console.log(`${consoleColors[level]}[${level}]${resetColor} ${logEntry}`);

    // File output
    switch (level) {
      case 'ERROR':
        this.errorLog.write(logEntry + '\n');
        break;
      case 'WARN':
      case 'INFO':
        this.appLog.write(logEntry + '\n');
        break;
      case 'DEBUG':
        // Debug logs only to app log in production
        if (process.env.NODE_ENV !== 'production') {
          this.appLog.write(logEntry + '\n');
        }
        break;
    }
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      ...meta,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      }
    } : meta;
    
    this.log('ERROR', message, errorMeta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // HTTP request logging
  logRequest(req, res, startTime) {
    const duration = Date.now() - startTime;
    
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.userId
    };

    this.accessLog.write(this.formatLog('INFO', 'HTTP Request', logData) + '\n');
  }

  // Database query logging
  logQuery(query, params, duration, error = null) {
    const logData = {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      params: params ? params.slice(0, 5) : [],
      duration: `${duration}ms`,
      hasError: !!error
    };

    if (error) {
      this.error('Database query failed', error, logData);
    } else {
      this.debug('Database query executed', logData);
    }
  }

  // Close log files
  close() {
    if (this.accessLog) this.accessLog.end();
    if (this.errorLog) this.errorLog.end();
    if (this.appLog) this.appLog.end();
  }
}

// Create global logger instance
const logger = new Logger('detailing-api');

// Express middleware for request logging
export function requestLogger() {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Log request completion
    res.on('finish', () => {
      logger.logRequest(req, res, startTime);
    });

    next();
  };
}

// Database query timing middleware
export function queryTimer(queryFunction) {
  return async (...args) => {
    const startTime = Date.now();
    try {
      const result = await queryFunction(...args);
      const duration = Date.now() - startTime;
      logger.logQuery(args[0], args[1], duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logQuery(args[0], args[1], duration, error);
      throw error;
    }
  };
}

// Error logging middleware
export function errorLogger() {
  return (error, req, res, next) => {
    logger.error('Unhandled error', error, {
      url: req.url,
      method: req.method,
      userId: req.userId
    });
    next(error);
  };
}

// Performance logging
export function performanceLogger(label) {
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      logger.info(`${label} completed`, {
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        url: req.url
      });
    });

    next();
  };
}

// Export logger instance and utilities
export default logger;
export { Logger, LOG_LEVELS };