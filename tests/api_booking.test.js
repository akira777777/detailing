import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set env var before anything else
process.env.DATABASE_URL = 'postgres://mock:mock@mock.com/mock';

const mockSql = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockSql),
}));

describe('Booking API', () => {
  let res;
  let handler;
  let req;

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
      const query = strings.join(' ');

      if (query.includes('INSERT')) {
        return [{ id: 123 }];
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

    // Create mock response
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis(),
    };
  });

  describe('Method Validation', () => {
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
      mockSql.mockResolvedValueOnce([{
        data: mockBookings,
        total: 1
      }]);

      req.method = 'GET';
      req.query = { limit: '10', offset: '0' };
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockBookings,
        total: 1
      });
    });

    it('should handle empty bookings list', async () => {
      mockSql.mockResolvedValueOnce([{ total: 0, data: [] }]);

      req.method = 'GET';
      req.query = { limit: '10', offset: '0' };
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should filter results by search query', async () => {
      const mockBookings = [
        { id: 1, car_model: 'Tesla Model S', package: 'Ceramic Coating', date: '2023-10-24', time: '10:30 AM', total_price: 100, status: 'Confirmed' }
      ];
      mockSql.mockResolvedValueOnce([{
        data: mockBookings,
        total: 1
      }]);

      req.method = 'GET';
      req.query = { search: 'Tesla' };
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockSql).toHaveBeenCalled();
      const lastCall = mockSql.mock.calls[0];
      expect(lastCall[0]).toEqual(expect.arrayContaining([expect.stringContaining('ILIKE')]));
      expect(lastCall).toContain('%Tesla%');
      expect(res.json).toHaveBeenCalledWith({
        data: mockBookings,
        total: 1
      });
    });

    it('should handle database errors on GET', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('Database error'); });

      req.method = 'GET';
      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Failed')
      }));
    });
  });

  describe('POST /bookings', () => {
    it('should return 201 for valid POST data', async () => {
      mockSql.mockResolvedValueOnce([{ id: 123 }]);

      req.method = 'POST';
      req.body = validBooking;

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        id: 123
      }));
    });

    it('should handle database errors on POST', async () => {
      mockSql.mockImplementationOnce(() => { throw new Error('DB Error'); });

      req.method = 'POST';
      req.body = validBooking;

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
  });

  describe('Environment Configuration', () => {
    it('should return 500 when DATABASE_URL is missing', async () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;

      // We need to re-import the module after deleting the env var
      // but because of how neon() is called at the top level of api/booking.js,
      // it might have already been initialized.
      // The handler check 'if (!sql)' should still work if we can reset the module.

      vi.resetModules();
      const mod = await import('../api/booking.js?t=' + Date.now());
      const h = mod.default;

      const q = { method: 'GET', query: {} };
      await h(q, res);
      
      expect(res.status).toHaveBeenCalledWith(500);

      process.env.DATABASE_URL = originalUrl;
    });
  });
});
