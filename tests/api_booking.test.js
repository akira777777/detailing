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
    const mod = await import('../api/booking?t=' + Date.now());
    handler = mod.default;

    req = {
      method: 'GET',
      query: {},
      body: {},
    };

    mockSql.mockImplementation(async (strings) => {
      if (!Array.isArray(strings)) return [];
      const query = strings[0];
      if (query.includes('INSERT')) return [{ id: 1 }];
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
      const mockBookings = [
        { id: 1, car_model: 'Test Car', package: 'Test Package', date: '2023-10-24', time: '10:30 AM', total_price: 100, status: 'Confirmed' }
      ];
      mockSql.mockResolvedValueOnce([{ data: mockBookings, total: 1 }]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockBookings, total: 1 });
    });

    it('should handle database errors on GET', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('Database error'); });
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('POST /bookings', () => {
    it('should return 201 for valid POST data', async () => {
      mockSql.mockResolvedValueOnce([{ id: 123 }]);
      req.method = 'POST';
      req.body = validBooking;
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 for invalid POST data', async () => {
      req.method = 'POST';
      req.body = { carModel: 'Tesla' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;
      vi.resetModules();
      const module = await import('../api/booking.js');
      const h = module.default;
      await h(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      process.env.DATABASE_URL = originalUrl;
    });
  });
});
