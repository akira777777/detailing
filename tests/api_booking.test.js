import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../api/booking';

// Mock the neon database
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn().mockImplementation(async (strings) => {
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
        return [{ id: 1 }];
    }
    return [];
  })),
}));

describe('Booking API', () => {
  let req, res;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    };
    process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
  });

  it('should return 405 for unsupported methods', async () => {
    req = { method: 'PUT' };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return 200 and list of bookings for GET', async () => {
    req = { method: 'GET', query: { limit: '10', offset: '0' } };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.any(Array),
      total: expect.any(Number)
    }));
  });

  it('should return 400 for invalid POST data (missing fields)', async () => {
    req = {
      method: 'POST',
      body: { date: '2023-10-24' },
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid booking data' }));
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
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Booking confirmed successfully' }));
  });
});
