import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @neondatabase/serverless
const mockSql = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql)
}));

// Mock zod
vi.mock('zod', async () => {
  const actual = await vi.importActual('zod');
  return {
    ...actual,
    z: actual.z
  };
});

describe('Booking API', () => {
  let req, res;
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Reset environment
    process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
    
    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };

    // Import handler fresh for each test
    const module = await import('../api/booking.js');
    handler = module.default;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('HTTP Method Handling', () => {
    it('should return 405 for unsupported methods', async () => {
      req = { method: 'PUT' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        error: expect.stringContaining('Not Allowed') 
      }));
    });

    it('should return 405 for DELETE method', async () => {
      req = { method: 'DELETE' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
    });

    it('should return 405 for PATCH method', async () => {
      req = { method: 'PATCH' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
    });
  });

  describe('GET /bookings', () => {
    it('should return 200 and list of bookings for GET', async () => {
      const mockBookings = [
        { 
          id: 1, 
          date: '2023-10-24', 
          time: '10:30 AM', 
          car_model: 'Test Car', 
          package: 'Test Package', 
          total_price: 100, 
          status: 'Confirmed' 
        }
      ];

      mockSql.mockResolvedValueOnce(mockBookings); // bookings query
      mockSql.mockResolvedValueOnce([{ count: '1' }]); // count query

      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number)
      }));
    });

    it('should handle empty bookings list', async () => {
      mockSql.mockResolvedValueOnce([]); // bookings query
      mockSql.mockResolvedValueOnce([{ count: '0' }]); // count query

      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should handle database errors on GET', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Failed')
      }));
    });

    it('should use default pagination values', async () => {
      mockSql.mockResolvedValueOnce([]);
      mockSql.mockResolvedValueOnce([{ count: '0' }]);

      req = { method: 'GET', query: {} };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle missing query parameter', async () => {
      mockSql.mockResolvedValueOnce([]);
      mockSql.mockResolvedValueOnce([{ count: '0' }]);

      req = { method: 'GET' };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('POST /bookings', () => {
    it('should return 400 for invalid POST data (missing fields)', async () => {
      req = {
        method: 'POST',
        body: { date: '2023-10-24' },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        error: 'Invalid booking data' 
      }));
    });

    it('should return 400 for invalid date format', async () => {
      req = {
        method: 'POST',
        body: {
          date: 'invalid-date',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        error: 'Invalid booking data' 
      }));
    });

    it('should return 400 for negative price', async () => {
      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: -100,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for zero price', async () => {
      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 0,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for empty car model', async () => {
      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: '',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for empty package name', async () => {
      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: '',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 201 for valid POST data', async () => {
      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: 'Booking confirmed successfully' 
      }));
    });

    it('should return booking id on successful creation', async () => {
      mockSql.mockResolvedValueOnce([{ id: 'booking-123' }]);

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        id: expect.any(String) 
      }));
    });

    it('should handle database errors on POST', async () => {
      mockSql.mockRejectedValueOnce(new Error('Database connection failed'));

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Failed to save booking'
      }));
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      delete process.env.DATABASE_URL;
      vi.resetModules();
      
      const module = await import('../api/booking.js');
      handler = module.default;

      req = { method: 'GET', query: {} };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('configuration')
      }));
    });
  });

  describe('Edge Cases', () => {
    it('should handle null body in POST request', async () => {
      req = {
        method: 'POST',
        body: null,
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle undefined body in POST request', async () => {
      req = {
        method: 'POST',
        body: undefined,
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle very large price values', async () => {
      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating',
          totalPrice: 999999.99,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle special characters in car model', async () => {
      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3 & Co. (Limited Edition)',
          packageName: 'Ceramic Coating',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle unicode characters in package name', async () => {
      mockSql.mockResolvedValueOnce([{ id: 1 }]);

      req = {
        method: 'POST',
        body: {
          date: '2023-10-24',
          time: '10:30 AM',
          carModel: 'Tesla Model 3',
          packageName: 'Ceramic Coating Premium 高级',
          totalPrice: 499.00,
        },
      };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Response Headers', () => {
    it('should set Allow header for 405 responses', async () => {
      req = { method: 'DELETE' };
      await handler(req, res);
      
      expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST']);
    });
  });
});
