import { z } from 'zod';

// Enhanced validation schemas with comprehensive error handling

// User validation schemas
export const userRegistrationSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email format' })
    .min(5, { message: 'Email must be at least 5 characters' })
    .max(255, { message: 'Email must be less than 255 characters' })
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password must be less than 128 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  firstName: z.string()
    .min(1, { message: 'First name is required' })
    .max(100, { message: 'First name must be less than 100 characters' })
    .trim(),
  
  lastName: z.string()
    .min(1, { message: 'Last name is required' })
    .max(100, { message: 'Last name must be less than 100 characters' })
    .trim(),
  
  phone: z.string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, { message: 'Invalid phone number format' })
    .optional()
});

export const userLoginSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email format' })
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(1, { message: 'Password is required' })
});

// Booking validation schemas
export const bookingCreateSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format. Use YYYY-MM-DD' })
    .refine((date) => {
      const bookingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    }, { message: 'Booking date cannot be in the past' }),
  
  time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format. Use HH:MM (24-hour)' })
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const startMinutes = 9 * 60; // 9:00 AM
      const endMinutes = 18 * 60;  // 6:00 PM
      return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
    }, { message: 'Booking time must be between 9:00 AM and 6:00 PM' }),
  
  carModel: z.string()
    .min(1, { message: 'Car model is required' })
    .max(100, { message: 'Car model must be less than 100 characters' })
    .trim(),
  
  packageId: z.string()
    .uuid({ message: 'Invalid package ID format' })
    .optional(),
  
  selectedModules: z.array(z.string().uuid({ message: 'Invalid module ID format' }))
    .max(10, { message: 'Cannot select more than 10 modules' })
    .optional(),
  
  totalPrice: z.number()
    .positive({ message: 'Total price must be positive' })
    .max(10000, { message: 'Total price cannot exceed $10,000' }),
  
  notes: z.string()
    .max(1000, { message: 'Notes must be less than 1000 characters' })
    .optional()
    .trim()
});

// Vehicle validation schemas
export const vehicleCreateSchema = z.object({
  make: z.string()
    .min(1, { message: 'Make is required' })
    .max(50, { message: 'Make must be less than 50 characters' })
    .trim(),
  
  model: z.string()
    .min(1, { message: 'Model is required' })
    .max(100, { message: 'Model must be less than 100 characters' })
    .trim(),
  
  year: z.number()
    .int()
    .min(1900, { message: 'Year must be 1900 or later' })
    .max(new Date().getFullYear() + 1, { message: 'Year cannot be in the future' }),
  
  color: z.string()
    .max(30, { message: 'Color must be less than 30 characters' })
    .optional()
    .trim(),
  
  licensePlate: z.string()
    .max(20, { message: 'License plate must be less than 20 characters' })
    .optional()
    .trim(),
  
  vin: z.string()
    .length(17, { message: 'VIN must be exactly 17 characters' })
    .optional()
});

// Pagination validation
export const paginationSchema = z.object({
  limit: z.number()
    .int()
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .default(10),
  
  offset: z.number()
    .int()
    .min(0, { message: 'Offset must be 0 or greater' })
    .default(0)
});

// Search and filter validation
export const searchFilterSchema = z.object({
  search: z.string()
    .max(100, { message: 'Search term must be less than 100 characters' })
    .optional()
    .trim(),
  
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  
  sortBy: z.enum(['created_at', 'updated_at', 'date', 'status'])
    .default('created_at'),
  
  sortOrder: z.enum(['ASC', 'DESC'])
    .default('DESC')
});

// Password reset schemas
export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email format' })
    .toLowerCase()
    .trim()
});

export const passwordResetSchema = z.object({
  token: z.string()
    .min(1, { message: 'Reset token is required' }),
  
  newPassword: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password must be less than 128 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

// Validation middleware
export function validateSchema(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
          code: 'VALIDATION_ERROR'
        });
      }
      
      return res.status(500).json({
        error: 'Internal server error during validation',
        code: 'VALIDATION_INTERNAL_ERROR'
      });
    }
  };
}

// Query parameter validation middleware
export function validateQueryParams(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.query);
      req.validatedQuery = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: errors,
          code: 'QUERY_VALIDATION_ERROR'
        });
      }
      
      return res.status(500).json({
        error: 'Internal server error during query validation',
        code: 'QUERY_VALIDATION_INTERNAL_ERROR'
      });
    }
  };
}

// Sanitize input helper
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000); // Limit length
  }
  return input;
}

// Custom validation utilities
export const validators = {
  isValidUUID: (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
  
  isValidDate: (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },
  
  isValidTime: (timeString) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }
};