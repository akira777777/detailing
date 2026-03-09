import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

// Database configuration with environment-specific settings
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    url: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    connectionTimeout: 10000, // 10 seconds
    maxRetries: 3,
    retryDelay: 1000 // 1 second
  };
};

// Initialize database connection with retry logic
const createDatabaseConnection = () => {
  const config = getDatabaseConfig();
  
  if (!config.url) {
    console.warn('⚠️ DATABASE_URL not configured. Database features will be disabled.');
    return {
      query: async () => {
        throw new Error('Database not configured. Please set DATABASE_URL environment variable.');
      },
      isConfigured: false
    };
  }
  
  try {
    const sql = neon(config.url, {
      ssl: config.ssl,
      connectionTimeoutMillis: config.connectionTimeout
    });
    
    return {
      query: async (strings, ...values) => {
        let lastError;
        
        for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
          try {
            // Handle both tagged template and regular function calls
            if (Array.isArray(strings)) {
              return await sql(strings, ...values);
            } else {
              // Regular parameterized query: query(text, params)
              return await sql(strings, values);
            }
          } catch (error) {
            lastError = error;
            console.warn(`Database query attempt ${attempt} failed:`, error.message);
            
            if (attempt < config.maxRetries) {
              await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
            }
          }
        }
        
        throw new DatabaseError(`Query failed after ${config.maxRetries} attempts: ${lastError.message}`, 'QUERY_FAILED');
      },
      isConfigured: true
    };
  } catch (error) {
    console.error('❌ Failed to create database connection:', error);
    return {
      query: async () => {
        throw new DatabaseError('Database connection failed', 'CONNECTION_FAILED');
      },
      isConfigured: false
    };
  }
};

// Export database instance
export const db = createDatabaseConnection();

// Validation schemas with enhanced validation
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number').optional()
});

export const vehicleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  make: z.string().min(1, 'Make is required').max(50, 'Make too long'),
  model: z.string().min(1, 'Model is required').max(100, 'Model too long'),
  year: z.number().int().min(1900, 'Year must be 1900 or later').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  color: z.string().max(30, 'Color too long').optional(),
  licensePlate: z.string().max(20, 'License plate too long').optional(),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'Invalid VIN format').optional()
});

export const bookingSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional(),
  vehicleId: z.string().uuid('Invalid vehicle ID').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, expected HH:MM'),
  carModel: z.string().min(1, 'Car model is required').max(100, 'Car model too long'),
  packageId: z.string().uuid('Invalid package ID').optional(),
  selectedModules: z.array(z.string().uuid('Invalid module ID')).optional(),
  totalPrice: z.number().positive('Total price must be positive').max(999999.99, 'Price exceeds maximum'),
  notes: z.string().max(1000, 'Notes too long').optional()
});

export const paymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash', 'paypal'], {
    errorMap: () => ({ message: 'Invalid payment method' })
  }),
  transactionId: z.string().max(100).optional(),
  notes: z.string().max(500).optional()
});

// Database error class with error codes
export class DatabaseError extends Error {
  constructor(message, code = 'DATABASE_ERROR', details = null) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    if (!db.isConfigured) {
      return {
        status: 'unconfigured',
        message: 'Database not configured',
        timestamp: new Date().toISOString()
      };
    }
    
    const startTime = Date.now();
    await db.query`SELECT 1 as health_check`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    };
  }
}

// Execute query with error handling
export async function executeQuery(queryText, params = []) {
  try {
    const result = await db.query(queryText, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    
    if (error.message?.includes('unique constraint')) {
      throw new DatabaseError('Duplicate entry found', 'DUPLICATE_ENTRY', error.message);
    }
    if (error.message?.includes('foreign key constraint')) {
      throw new DatabaseError('Referenced record not found', 'FOREIGN_KEY_VIOLATION', error.message);
    }
    if (error.message?.includes('check constraint')) {
      throw new DatabaseError('Data validation failed', 'CHECK_CONSTRAINT_VIOLATION', error.message);
    }
    
    throw new DatabaseError(`Query execution failed: ${error.message}`, 'QUERY_ERROR');
  }
}

// Transaction wrapper with proper rollback
export async function withTransaction(operations) {
  if (!db.isConfigured) {
    throw new DatabaseError('Database not configured', 'NOT_CONFIGURED');
  }
  
  try {
    await db.query`BEGIN`;
    const result = await operations(db.query);
    await db.query`COMMIT`;
    return result;
  } catch (error) {
    await db.query`ROLLBACK`.catch(rollbackError => {
      console.error('Rollback failed:', rollbackError);
    });
    throw error;
  }
}

// Pagination helper with validation
export function createPagination(limit = 10, offset = 0) {
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const parsedOffset = Math.max(parseInt(offset) || 0, 0);
  return { limit: parsedLimit, offset: parsedOffset };
}

// Sort helper with allowed columns whitelist
export function createSort(sortBy = 'created_at', sortOrder = 'DESC', allowedColumns = null) {
  const defaultColumns = ['created_at', 'updated_at', 'date', 'status', 'id', 'name', 'email'];
  const columns = allowedColumns || defaultColumns;
  
  // Prevent SQL injection by whitelisting columns
  const column = columns.includes(sortBy) ? sortBy : 'created_at';
  const direction = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  return { column, direction };
}

// Connection pool status (for monitoring)
export function getConnectionStatus() {
  return {
    isConfigured: db.isConfigured,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };
}
