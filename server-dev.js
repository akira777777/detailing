import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database for development
let nextId = 1;

// In-memory storage for development
const bookingsDB = {
  data: [],
  insert: function(booking) {
    const newBooking = {
      id: nextId++,
      ...booking,
      created_at: new Date().toISOString(),
      status: 'Confirmed'
    };
    this.data.push(newBooking);
    return newBooking;
  },
  getAll: function(limit = 10, offset = 0) {
    return this.data.slice(offset, offset + limit);
  },
  getCount: function() {
    return this.data.length;
  }
};

// Booking API routes
app.get('/api/booking', (req, res) => {
  try {
    const { limit = '10', offset = '0' } = req.query;
    const limitVal = parseInt(limit);
    const offsetVal = parseInt(offset);
    
    const bookings = bookingsDB.getAll(limitVal, offsetVal);
    const total = bookingsDB.getCount();
    
    res.status(200).json({
      data: bookings,
      total
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/booking', (req, res) => {
  try {
    const { date, time, carModel, packageName, totalPrice } = req.body;
    
    // Validation
    if (!date || !time || !carModel || !packageName || !totalPrice) {
      return res.status(400).json({ 
        error: 'Invalid booking data',
        details: ['All fields are required']
      });
    }
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format, expected YYYY-MM-DD'
      });
    }
    
    // Validate price
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return res.status(400).json({
        error: 'Total price must be positive'
      });
    }
    
    const newBooking = bookingsDB.insert({
      date,
      time,
      car_model: carModel,
      package: packageName,
      total_price: totalPrice
    });
    
    console.log(`New booking created with ID: ${newBooking.id}`);
    res.status(201).json({
      message: 'Booking confirmed successfully',
      id: newBooking.id
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Booking API server running on port ${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/booking`);
  console.log(`💾 Using in-memory database`);
});
