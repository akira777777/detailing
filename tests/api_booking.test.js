import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Single mock function to control SQL queries
const mockSql = vi.fn();

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql),
}));

describe('Booking API', () => {
  let res;
  let handler;

  beforeEach(async () => {
    vi.resetAllMocks();
    
    // Set default implementation
    mockSql.mockImplementation(async (strings) => {
      if (!Array.isArray(strings)) return [];
      const query = strings[0];

      if (query.includes('INSERT')) {
        return [{ id: 1 }];
      }

      if (query.includes('SELECT') && query.includes('JSON_AGG')) {
        return [{
          total: 1,
          data: [{
            id: 1,
            date: '2023-10-24',
            time: '10:30 AM',
            car_model: 'Test Car',
            package: 'Test Package',
            total_price: 100,
            status: 'Confirmed'
          }]
        }];
      }

      return [];
    });

    // Reset environment
    process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
    
    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };

    // Import handler fresh for each test to ensure it uses the mock
    vi.resetModules();
    const module = await import('../api/booking.js');
    handler = module.default;
  });

  describe('HTTP Method Handling', () => {
    it('should return 405 for unsupported methods', async () => {
      const req = { method: 'PUT' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        error: expect.stringContaining('Not Allowed') 
      }));
    });
  });

  describe('GET /bookings', () => {
    it('should return 200 and list of bookings for GET', async () => {
      const req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        total: 1
      }));
    });

    it('should handle empty bookings list', async () => {
      mockSql.mockResolvedValueOnce([{ total: 0, data: [] }]);

      const req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should handle database errors on GET', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('Database error'); });

      const req = { method: 'GET', query: { limit: '10', offset: '0' } };
      await handler(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('POST /bookings', () => {
    it('should return 201 for valid POST data', async () => {
      mockSql.mockResolvedValueOnce([{ id: 123 }]);

      const req = {
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
        id: 123
      }));
    });

    it('should handle database errors on POST', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('DB Error'); });

      const req = {
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
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      delete process.env.DATABASE_URL;
      vi.resetModules();
      const module = await import('../api/booking.js');
      const h = module.default;

      const req = { method: 'GET', query: {} };
      await h(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
