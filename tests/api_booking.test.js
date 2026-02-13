import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @neondatabase/serverless
let mockDbResponse = null;
let shouldThrowError = false;

<<<<<<< Updated upstream
const createMockSql = () => {
  return vi.fn().mockImplementation(async (strings, ...values) => {
    if (shouldThrowError) {
      throw new Error('Database error');
    }
    
    // Allow tests to override response
    if (mockDbResponse !== null) {
      const response = mockDbResponse;
      mockDbResponse = null; // Reset after use
      return response;
    }
    
    // Basic mock to simulate SQL behavior for the new robust single-query approach
    if (strings[0].includes('SELECT') && strings[0].includes('JSON_AGG')) {
      return [{
        total: 1,
        data: [{ id: 1, date: '2023-10-24', time: '10:30 AM', car_model: 'Test Car', package: 'Test Package', total_price: 100, status: 'Confirmed' }]
      }];
    }
    // Fallback for other SELECT queries (if any)
    if (strings[0].includes('SELECT')) {
      return [{ id: 1, date: '2023-10-24', time: '10:30 AM', car_model: 'Test Car', package: 'Test Package', total_price: 100, status: 'Confirmed' }];
    }
    if (strings[0].includes('INSERT')) {
        return [{ id: 'booking-123' }];
    }
    return [];
  });
};

let mockSql = createMockSql();

<<<<<<< Updated upstream
// Single mock function to control SQL queries
const mockSql = vi.fn();
=======
=======
<<<<<<< HEAD
// Single mock function to control SQL queries
=======
>>>>>>> origin/palette-calendar-enhancements-267134661186377706
const mockSql = vi.fn();
>>>>>>> Stashed changes
>>>>>>> Stashed changes
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql),
}));

<<<<<<< Updated upstream
// Mock zod
vi.mock('zod', async () => {
  const actual = await vi.importActual('zod');
  return {
    ...actual,
    z: actual.z
=======
describe('Booking API', () => {
  let handler;
  let req;

  const validBooking = {
    carModel: 'Tesla Model 3',
    packageName: 'Full Detail',
    date: '2023-11-01',
    time: '09:00 AM',
    totalPrice: 250
>>>>>>> Stashed changes
  };
});

describe('Booking API', () => {
  let req, res;
  let handler;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Reset mock state
    mockSql = createMockSql();
    mockDbResponse = null;
    shouldThrowError = false;
    
    // Reset environment
    process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
    
    vi.resetModules();

    // Re-import the handler to ensure it sees the DATABASE_URL and mocks
    const mod = await import('../api/booking.js?t=' + Date.now());
    handler = mod.default;

    req = {
      method: 'GET',
      query: {},
      body: {},
    };
    
    // Set default implementation for SQL

    // Set default implementation
    mockSql.mockImplementation(async (strings) => {
      if (!Array.isArray(strings)) return [];
      const query = strings[0];

      if (query.includes('INSERT')) {
        return [{ id: 123 }];
      }

      if (query.includes('SELECT') && query.includes('JSON_AGG')) {
        return [{
          total: 1,
          data: [{
            id: 1, date: '2023-10-24', time: '10:30 AM', car_model: 'Test Car',
            package: 'Test Package', total_price: 100, status: 'Confirmed'
          }]
        }];
      }
      return [];
    });

    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };

    // Import handler fresh for each test
    vi.resetModules();
    const module = await import('../api/booking.js');
    handler = module.default;
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('HTTP Method Handling', () => {
  describe('HTTP Method Handling', () => {
  describe('Method Validation', () => {
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
      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      const mockBookings = [
        { id: 1, car_model: 'Test Car', package: 'Test Package', date: '2023-10-24', time: '10:30 AM', total_price: 100, status: 'Confirmed' }
      ];

      // The handler expects the aggregate query to return { total, data }
      mockSql.mockResolvedValueOnce([{
        data: mockBookings,
        total: 1

      mockSql.mockResolvedValueOnce([{
        total: 1,
        data: mockBookings
      }]);

      req.method = 'GET';
      req.query = { limit: '10', offset: '0' };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        total: expect.any(Number)
      }));
    });

    it('should handle empty bookings list', async () => {
      // Set mock to return empty data
      mockDbResponse = [{
        total: 0,
        data: []
      }];

      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should handle database errors on GET', async () => {
      // Set flag to throw error
      shouldThrowError = true;
      mockSql.mockImplementationOnce(() => { throw new Error('Database error'); });
      mockSql.mockRejectedValueOnce(new Error('Database error'));

      req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Failed')
      }));
    });

    it('should use default pagination values', async () => {
      req = { method: 'GET', query: {} };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle missing query parameter', async () => {
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
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 123
      }));
    });

    it('should handle database errors on POST', async () => {
      // Set flag to throw error
      shouldThrowError = true;

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
      mockSql.mockImplementationOnce(() => { throw new Error('DB Error'); });
      mockSql.mockRejectedValueOnce(new Error('DB Error'));

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
  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;

      // Fresh import to trigger the check if it happens at module level
      // Though in many handlers it happens inside the handler
      vi.resetModules();
      const mod = await import('../api/booking.js?t=' + Date.now());
      const h = mod.default;

      req.method = 'GET';
      const module = await import('../api/booking.js?t=' + Date.now());
      const h = module.default;
      await h(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      process.env.DATABASE_URL = originalUrl;
    });
  });
});
