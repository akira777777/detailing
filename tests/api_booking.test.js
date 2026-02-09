import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set env var before anything else
process.env.DATABASE_URL = 'postgres://mock:mock@mock.com/mock';

const mockSql = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql),
}));

describe('Booking API', () => {
  let handler;
  let req, res;

  const validBooking = {
    carModel: 'Tesla Model 3',
    packageName: 'Full Detail',
    date: '2023-11-01',
    time: '09:00 AM',
    totalPrice: 250
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    const mod = await import('../api/booking.js?t=' + Date.now());
    handler = mod.default;

    req = {
      method: 'GET',
      query: {},
      body: {},
    };
    
    // Set default implementation
    mockSql.mockImplementation(async (strings) => {
      if (!Array.isArray(strings)) return [];
      const query = strings[0];

      if (query.includes('INSERT')) {
        return [{ id: 123 }];
      }

      if (query.includes('SELECT') && (query.includes('JSON_AGG') || query.includes('total'))) {
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

    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis(),
    };
  });

  describe('HTTP Method Handling', () => {
    it('should return 405 for unsupported methods', async () => {
      req.method = 'PUT';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
    });
 
    it('should return 405 for DELETE method', async () => {
      req.method = 'DELETE';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
    });
  });

  describe('GET /bookings', () => {
    it('should return 200 and list of bookings for GET', async () => {
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        total: 1
      }));
    });

    it('should handle empty bookings list', async () => {
      mockSql.mockResolvedValueOnce([{ total: 0, data: [] }]);

      req.query = { limit: '10', offset: '0' };
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should handle database errors on GET', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('Database error'); });

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('POST /bookings', () => {
    it('should return 201 for valid POST data', async () => {
      req.method = 'POST';
      req.body = validBooking;

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        id: 123
      }));
    });

    it('should handle database errors on POST', async () => {
      req.method = 'POST';
      req.body = validBooking;
      mockSql.mockImplementationOnce(() => { throw new Error('DB Error'); });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 400 for invalid POST data (missing fields)', async () => {
      req.method = 'POST';
      req.body = { carModel: 'Tesla' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid date format', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, date: 'invalid-date' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for negative totalPrice', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, totalPrice: -100 };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null body in POST request', async () => {
      req.method = 'POST';
      req.body = null;
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle special characters in carModel', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, carModel: 'Model S P100D (Ludicrous+)' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle unicode characters in packageName', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, packageName: 'Premium ✨ Detail' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;

      // Need to re-import handler to pick up missing env var
      vi.resetModules();
      const module = await import('../api/booking.js');
      const h = module.default;

      await h(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      process.env.DATABASE_URL = originalUrl;
    });
  });
});
