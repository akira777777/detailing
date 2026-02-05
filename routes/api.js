import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { db, bookingSchema, vehicleSchema } from '../db/database.js';
import { authenticateToken } from '../auth/auth.js';
import { runMigrations } from '../db/migrations.js';

const router = express.Router();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 booking requests per hour
  message: {
    error: 'Too many booking attempts, please try again later.'
  }
});

// Apply middleware
router.use(apiLimiter);
router.use(helmet());
router.use(compression());

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

// Request validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors?.map(e => e.message) || [error.message]
      });
    }
  };
}

// Enhanced booking endpoints
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const { limit = '10', offset = '0', status, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
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
        u.first_name,
        u.last_name,
        u.email
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.user_id = $1
    `;
    
    const params = [req.userId];
    
    // Add status filter if provided
    if (status) {
      query += ' AND b.status = $2';
      params.push(status);
    }
    
    // Add ordering
    query += ` ORDER BY b.${sortBy} ${sortOrder.toUpperCase()}`;
    
    // Add pagination
    query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM bookings WHERE user_id = $1';
    const countParams = [req.userId];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult[0].count);
    
    res.json({
      data: result,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT 
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
       WHERE b.id = $1 AND (b.user_id = $2 OR u.role IN ('admin', 'staff'))`,
      [id, req.userId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

router.post('/bookings', bookingLimiter, authenticateToken, validateRequest(bookingSchema), async (req, res) => {
  try {
    const { date, time, carModel, packageId, selectedModules, totalPrice, notes, vehicleId } = req.body;
    
    const result = await db.query(
      `INSERT INTO bookings 
       (user_id, vehicle_id, date, time, car_model, package_id, selected_modules, total_price, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, created_at`,
      [req.userId, vehicleId, date, time, carModel, packageId, selectedModules || [], totalPrice, notes || null]
    );
    
    const newBooking = result[0];
    
    // Log booking creation
    console.log(`New booking created: ${newBooking.id} by user ${req.userId}`);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: newBooking.id,
        createdAt: newBooking.created_at
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.put('/bookings/:id', authenticateToken, validateRequest(bookingSchema.partial()), async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, carModel, packageId, selectedModules, totalPrice, notes, status } = req.body;
    
    // Check if booking belongs to user or user has admin rights
    const ownershipCheck = await db.query(
      'SELECT user_id FROM bookings WHERE id = $1',
      [id]
    );
    
    if (ownershipCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (ownershipCheck[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to modify this booking' });
    }
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      params.push(date);
    }
    if (time !== undefined) {
      updates.push(`time = $${paramIndex++}`);
      params.push(time);
    }
    if (carModel !== undefined) {
      updates.push(`car_model = $${paramIndex++}`);
      params.push(carModel);
    }
    if (packageId !== undefined) {
      updates.push(`package_id = $${paramIndex++}`);
      params.push(packageId);
    }
    if (selectedModules !== undefined) {
      updates.push(`selected_modules = $${paramIndex++}`);
      params.push(selectedModules);
    }
    if (totalPrice !== undefined) {
      updates.push(`total_price = $${paramIndex++}`);
      params.push(totalPrice);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      params.push(notes);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }
    
    updates.push(`updated_at = NOW()`);
    params.push(id);
    
    const query = `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(query, params);
    
    res.json({
      message: 'Booking updated successfully',
      booking: result[0]
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.delete('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if booking belongs to user
    const ownershipCheck = await db.query(
      'SELECT user_id, status FROM bookings WHERE id = $1',
      [id]
    );
    
    if (ownershipCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = ownershipCheck[0];
    
    if (booking.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }
    
    // Only allow deletion of pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be deleted' });
    }
    
    await db.query('DELETE FROM bookings WHERE id = $1', [id]);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Vehicle management endpoints
router.get('/vehicles', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.post('/vehicles', authenticateToken, validateRequest(vehicleSchema), async (req, res) => {
  try {
    const { make, model, year, color, licensePlate, vin, notes } = req.body;
    
    const result = await db.query(
      `INSERT INTO vehicles 
       (user_id, make, model, year, color, license_plate, vin, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.userId, make, model, year, color, licensePlate, vin, notes]
    );
    
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Service packages and modules
router.get('/services/packages', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM service_packages WHERE is_active = true ORDER BY category, name'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    res.status(500).json({ error: 'Failed to fetch service packages' });
  }
});

router.get('/services/modules', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM service_modules WHERE is_active = true ORDER BY category, name'
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching service modules:', error);
    res.status(500).json({ error: 'Failed to fetch service modules' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await db.query('SELECT 1');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Initialize database on startup
router.initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    await runMigrations(db.query);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export default router;