import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set env var before anything else
process.env.DATABASE_URL = 'postgres://mock:mock@mock.com/mock';

const mockQuery = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => mockQuery),
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
    // Re-import the handler to ensure it sees the DATABASE_URL
    const mod = await import('../api/booking?t=' + Date.now());
    handler = mod.default;

    req = {
      method: 'GET',
      query: {},
      body: {},
    };
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

    it('should return 405 for PATCH method', async () => {
      req.method = 'PATCH';
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
    });
  });

  describe('GET /bookings', () => {
    it('should return 200 and list of bookings for GET', async () => {
      const mockBookings = [
        { id: 1, car_model: 'Test Car', package: 'Test Package', date: '2023-10-24', time: '10:30 AM', total_price: 100, status: 'Confirmed' }
      ];
      mockQuery.mockResolvedValueOnce([{
        data: mockBookings,
        total: 1
      }]);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockBookings,
        total: 1
      });
    });

    it('should handle empty bookings list', async () => {
      mockQuery.mockResolvedValueOnce([{
        data: [],
        total: 0
      }]);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        total: 0
      });
    });

    it('should handle database errors on GET', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Failed')
      }));
    });
  });

  describe('POST /bookings', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.body = validBooking;
    });

    it('should return 201 for valid POST data', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return booking id on successful creation', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        id: 1
      }));
    });

    it('should handle database errors on POST', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database error'));
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'Failed to save booking'
      }));
    });

    it('should return 400 for invalid POST data (missing fields)', async () => {
      req.body = { carModel: 'Tesla' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid date format', async () => {
      req.body = { ...validBooking, date: 'invalid-date' };
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for negative totalPrice', async () => {
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

    it('should handle undefined body in POST request', async () => {
      req.method = 'POST';
      req.body = undefined;
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle very large totalPrice values', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, totalPrice: 1000000 };
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle special characters in carModel', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, carModel: 'Model S P100D (Ludicrous+)' };
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle unicode characters in packageName', async () => {
      req.method = 'POST';
      req.body = { ...validBooking, packageName: 'Premium ✨ Detail' };
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
