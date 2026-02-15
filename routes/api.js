import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { z } from 'zod';
import { db, bookingSchema, vehicleSchema, createPagination, createSort, DatabaseError } from '../db/database.js';
import { authenticateToken } from '../auth/auth.js';
import { runMigrations, getMigrationStatus } from '../db/migrations.js';

const router = express.Router();

// Enhanced validation schemas
const uuidSchema = z.string().uuid('Invalid ID format');

const paginationSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(0)).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'date', 'status', 'total_price']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional()
});

const bookingFilterSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test' // Skip rate limiting in tests
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 bookings per hour
  message: {
    error: 'Too many booking attempts, please try again later.',
    retryAfter: 3600
  },
  keyGenerator: (req) => req.userId || req.ip // Rate limit per user
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Stricter limit for sensitive operations
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Apply global middleware
router.use(apiLimiter);
router.use(helmet());
router.use(compression());

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : ['http://localhost:5173', 'http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

// Request validation middleware
function validateRequest(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code
          }))
        });
      }
      next(error);
    }
  };
}

// Sanitization middleware
function sanitizeInput(req, res, next) {
  // Remove null bytes and trim strings
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // eslint-disable-next-line no-control-regex
      return obj.replace(/\x00/g, '').trim().substring(0, 10000); // Limit string length
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, sanitize(v)])
      );
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
    if (req.query) {
    try {
      req.query = sanitize(req.query);
    } catch {
      // Ignore if read-only property
    }
  }
  next();
}

router.use(sanitizeInput);

// Error response helper
function createErrorResponse(error, includeStack = false) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const response = {
    error: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };
  
  if (error instanceof DatabaseError && error.details) {
    response.details = error.details;
  }
  
  if (!isProduction && includeStack) {
    response.stack = error.stack;
  }
  
  return response;
}

// ===== BOOKING ENDPOINTS =====

// GET /bookings - List bookings
router.get('/bookings', 
  authenticateToken, 
  validateRequest(paginationSchema.merge(bookingFilterSchema), 'query'),
  async (req, res) => {
    try {
      const { 
        limit = 10, 
        offset = 0, 
        status, 
        sortBy = 'created_at', 
        sortOrder = 'DESC',
        dateFrom,
        dateTo
      } = req.query;
      
      const pagination = createPagination(limit, offset);
      const sort = createSort(sortBy, sortOrder);
      
      let query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.car_model,
          b.total_price,
          b.status,
          b.created_at,
          b.updated_at,
          b.notes,
          u.first_name,
          u.last_name,
          u.email
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.user_id = $1
      `;
      
      const queryParams = [req.userId];
      
      if (status) {
        queryParams.push(status);
        query += ` AND b.status = $${queryParams.length}`;
      }
      if (dateFrom) {
        queryParams.push(dateFrom);
        query += ` AND b.date >= $${queryParams.length}`;
      }
      if (dateTo) {
        queryParams.push(dateTo);
        query += ` AND b.date <= $${queryParams.length}`;
      }
      
      query += ` ORDER BY b.${sort.column} ${sort.direction}`;
      query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

      queryParams.push(pagination.limit, pagination.offset);
      
      const result = await db.query(query, queryParams);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) FROM bookings b WHERE b.user_id = $1`;
      const countParams = [req.userId];

      if (status) {
        countParams.push(status);
        countQuery += ` AND b.status = $${countParams.length}`;
      }
      if (dateFrom) {
        countParams.push(dateFrom);
        countQuery += ` AND b.date >= $${countParams.length}`;
      }
      if (dateTo) {
        countParams.push(dateTo);
        countQuery += ` AND b.date <= $${countParams.length}`;
      }
      
      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult[0].count);
      
      res.json({
        data: result,
        total,
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: offset + result.length < total
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// GET /bookings/:id - Get single booking
router.get('/bookings/:id', 
  authenticateToken, 
  validateRequest(z.object({ id: uuidSchema }), 'params'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await db.query`
        SELECT 
          b.*,
          u.first_name,
          u.last_name,
          u.email,
          v.make,
          v.model,
          v.year,
          v.color
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = ${id} AND (b.user_id = ${req.userId} OR u.role IN ('admin', 'staff'))
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ 
          error: 'Booking not found',
          code: 'NOT_FOUND'
        });
      }
      
      res.json(result[0]);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// POST /bookings - Create booking
router.post('/bookings', 
  bookingLimiter, 
  authenticateToken, 
  validateRequest(bookingSchema),
  async (req, res) => {
    try {
      const { date, time, carModel, packageId, selectedModules, totalPrice, notes, vehicleId } = req.body;
      
      // Validate date is not in the past
      const bookingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        return res.status(400).json({
          error: 'Booking date cannot be in the past',
          code: 'INVALID_DATE'
        });
      }
      
      // Check for duplicate bookings (same user, same date/time)
      const existingBooking = await db.query`
        SELECT id FROM bookings 
        WHERE user_id = ${req.userId} 
        AND date = ${date} 
        AND time = ${time}
        AND status NOT IN ('cancelled', 'completed')
      `;
      
      if (existingBooking.length > 0) {
        return res.status(409).json({
          error: 'You already have a booking at this date and time',
          code: 'DUPLICATE_BOOKING'
        });
      }
      
      const result = await db.query`
        INSERT INTO bookings 
        (user_id, vehicle_id, date, time, car_model, package_id, selected_modules, total_price, notes)
        VALUES (${req.userId}, ${vehicleId || null}, ${date}, ${time}, ${carModel}, ${packageId || null}, ${selectedModules || []}, ${totalPrice}, ${notes || null})
        RETURNING id, created_at
      `;
      
      const newBooking = result[0];
      
      console.log(`New booking created: ${newBooking.id} by user ${req.userId}`);
      
      res.status(201).json({
        message: 'Booking created successfully',
        code: 'BOOKING_CREATED',
        booking: {
          id: newBooking.id,
          createdAt: newBooking.created_at
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// PUT /bookings/:id - Update booking
router.put('/bookings/:id', 
  authenticateToken, 
  validateRequest(z.object({ id: uuidSchema }), 'params'),
  validateRequest(bookingSchema.partial()),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { date, time, carModel, packageId, selectedModules, totalPrice, notes, status } = req.body;
      
      // Check if booking belongs to user
      const ownershipCheck = await db.query`
        SELECT user_id, status FROM bookings WHERE id = ${id}
      `;
      
      if (ownershipCheck.length === 0) {
        return res.status(404).json({ 
          error: 'Booking not found',
          code: 'NOT_FOUND'
        });
      }
      
      const booking = ownershipCheck[0];
      
      if (booking.user_id !== req.userId && req.userRole !== 'admin') {
        return res.status(403).json({ 
          error: 'Not authorized to modify this booking',
          code: 'FORBIDDEN'
        });
      }
      
      // Only allow updates to pending or confirmed bookings
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({ 
          error: 'Cannot modify booking that is in progress or completed',
          code: 'INVALID_STATUS'
        });
      }
      
      // Build update query dynamically
      const updates = [];
      const params = [];
      
      if (date !== undefined) {
        updates.push(`date = ${date}`);
        params.push(date);
      }
      if (time !== undefined) {
        updates.push(`time = ${time}`);
        params.push(time);
      }
      if (carModel !== undefined) {
        updates.push(`car_model = ${carModel}`);
        params.push(carModel);
      }
      if (packageId !== undefined) {
        updates.push(`package_id = ${packageId}`);
        params.push(packageId);
      }
      if (selectedModules !== undefined) {
        updates.push(`selected_modules = ${selectedModules}`);
        params.push(selectedModules);
      }
      if (totalPrice !== undefined) {
        updates.push(`total_price = ${totalPrice}`);
        params.push(totalPrice);
      }
      if (notes !== undefined) {
        updates.push(`notes = ${notes}`);
        params.push(notes);
      }
      if (status !== undefined) {
        updates.push(`status = ${status}`);
        params.push(status);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ 
          error: 'No valid fields provided for update',
          code: 'NO_UPDATES'
        });
      }
      
      // Use raw query for dynamic updates
      const query = `UPDATE bookings SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length + 1} RETURNING *`;
      params.push(id);
      
      const result = await db.query(query, params);
      
      res.json({
        message: 'Booking updated successfully',
        code: 'BOOKING_UPDATED',
        booking: result[0]
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// DELETE /bookings/:id - Cancel booking
router.delete('/bookings/:id', 
  authenticateToken, 
  validateRequest(z.object({ id: uuidSchema }), 'params'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if booking belongs to user
      const ownershipCheck = await db.query`
        SELECT user_id, status FROM bookings WHERE id = ${id}
      `;
      
      if (ownershipCheck.length === 0) {
        return res.status(404).json({ 
          error: 'Booking not found',
          code: 'NOT_FOUND'
        });
      }
      
      const booking = ownershipCheck[0];
      
      if (booking.user_id !== req.userId && req.userRole !== 'admin') {
        return res.status(403).json({ 
          error: 'Not authorized to delete this booking',
          code: 'FORBIDDEN'
        });
      }
      
      // Soft delete by updating status to cancelled
      await db.query`
        UPDATE bookings 
        SET status = 'cancelled', updated_at = NOW() 
        WHERE id = ${id}
      `;
      
      res.json({ 
        message: 'Booking cancelled successfully',
        code: 'BOOKING_CANCELLED'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// ===== VEHICLE ENDPOINTS =====

// GET /vehicles - List user vehicles
router.get('/vehicles', authenticateToken, async (req, res) => {
  try {
    const result = await db.query`
      SELECT * FROM vehicles WHERE user_id = ${req.userId} ORDER BY created_at DESC
    `;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json(createErrorResponse(error));
  }
});

// POST /vehicles - Create vehicle
router.post('/vehicles', 
  authenticateToken, 
  validateRequest(vehicleSchema),
  async (req, res) => {
    try {
      const { make, model, year, color, licensePlate, vin, notes } = req.body;
      
      // Validate VIN format if provided
      if (vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
        return res.status(400).json({
          error: 'Invalid VIN format',
          code: 'INVALID_VIN'
        });
      }
      
      // Check for duplicate VIN
      if (vin) {
        const existingVin = await db.query`
          SELECT id FROM vehicles WHERE vin = ${vin.toUpperCase()} AND user_id != ${req.userId}
        `;
        if (existingVin.length > 0) {
          return res.status(409).json({
            error: 'Vehicle with this VIN already exists',
            code: 'DUPLICATE_VIN'
          });
        }
      }
      
      const result = await db.query`
        INSERT INTO vehicles 
        (user_id, make, model, year, color, license_plate, vin, notes)
        VALUES (${req.userId}, ${make}, ${model}, ${year}, ${color || null}, ${licensePlate || null}, ${vin ? vin.toUpperCase() : null}, ${notes || null})
        RETURNING *
      `;
      
      res.status(201).json({
        message: 'Vehicle created successfully',
        code: 'VEHICLE_CREATED',
        vehicle: result[0]
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json(createErrorResponse(error));
    }
  }
);

// ===== SERVICE ENDPOINTS =====

// GET /services/packages - List service packages
router.get('/services/packages', async (req, res) => {
  try {
    const result = await db.query`
      SELECT * FROM service_packages WHERE is_active = true ORDER BY category, name
    `;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    res.status(500).json(createErrorResponse(error));
  }
});

// GET /services/modules - List service modules
router.get('/services/modules', async (req, res) => {
  try {
    const result = await db.query`
      SELECT * FROM service_modules WHERE is_active = true ORDER BY category, name
    `;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching service modules:', error);
    res.status(500).json(createErrorResponse(error));
  }
});

// ===== HEALTH & STATUS ENDPOINTS =====

// GET /health - Health check
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await import('../db/database.js').then(m => m.checkDatabaseHealth());
    const migrationStatus = await getMigrationStatus(db.query);
    
    const isHealthy = dbHealth.status === 'healthy';
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      migrations: migrationStatus,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// GET /ready - Readiness probe
router.get('/ready', async (req, res) => {
  try {
    if (!db.isConfigured) {
      return res.status(503).json({
        ready: false,
        reason: 'Database not configured'
      });
    }
    
    await db.query`SELECT 1`;
    res.json({ ready: true });
  } catch {
    res.status(503).json({
      ready: false,
      reason: 'Database connection failed'
    });
  }
});

// ===== ADMIN ENDPOINTS =====

// GET /admin/migrations - Migration status (admin only)
router.get('/admin/migrations', strictLimiter, authenticateToken, async (req, res) => {
  try {
    // In a real app, check admin role here
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const status = await getMigrationStatus(db.query);
    res.json(status);
  } catch (error) {
    console.error('Error getting migration status:', error);
    res.status(500).json(createErrorResponse(error));
  }
});

// POST /admin/migrations - Run migrations (admin only)
router.post('/admin/migrations', strictLimiter, authenticateToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await runMigrations(db.query);
    res.json(result);
  } catch (error) {
    console.error('Error running migrations:', error);
    res.status(500).json(createErrorResponse(error));
  }
});

// Initialize database on startup
router.initializeDatabase = async () => {
  try {
    if (!db.isConfigured) {
      console.warn('⚠️ Database not configured, skipping initialization');
      return { success: false, reason: 'Database not configured' };
    }
    
    console.log('🔄 Initializing database...');
    const result = await runMigrations(db.query);
    console.log('✅ Database initialized successfully');
    return result;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default router;
