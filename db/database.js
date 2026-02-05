import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

// Database connection
export const db = {
  query: process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null
};

// Validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional()
});

export const vehicleSchema = z.object({
  userId: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vin: z.string().optional()
});

export const bookingSchema = z.object({
  userId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  carModel: z.string().min(1),
  packageId: z.string().uuid().optional(),
  selectedModules: z.array(z.string().uuid()).optional(),
  totalPrice: z.number().positive(),
  notes: z.string().optional()
});

export const paymentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash', 'paypal']),
  transactionId: z.string().optional(),
  notes: z.string().optional()
});

// Database helper functions
export class DatabaseError extends Error {
  constructor(message, code = 'DATABASE_ERROR') {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

export async function executeQuery(query, params = []) {
  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new DatabaseError(`Database operation failed: ${error.message}`);
  }
}

// Transaction wrapper
export async function withTransaction(operations) {
  const client = db.query;
  try {
    await client`BEGIN`;
    const result = await operations(client);
    await client`COMMIT`;
    return result;
  } catch (error) {
    await client`ROLLBACK`;
    throw error;
  }
}

// Pagination helper
export function createPagination(limit = 10, offset = 0) {
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const parsedOffset = Math.max(parseInt(offset) || 0, 0);
  return { limit: parsedLimit, offset: parsedOffset };
}

// Sort helper
export function createSort(sortBy = 'created_at', sortOrder = 'DESC') {
  const allowedColumns = ['created_at', 'updated_at', 'date', 'status'];
  const column = allowedColumns.includes(sortBy) ? sortBy : 'created_at';
  const direction = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { column, direction };
}