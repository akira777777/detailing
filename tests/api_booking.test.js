import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../api/booking';

// Mock the neon database
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn().mockImplementation(async (strings) => {
    // Basic mock to simulate SQL behavior
    if (strings[0].includes('SELECT')) {
      return [{ id: 1, date: '24', time: '10:30 AM', car_model: 'Test Car', package: 'Test Package', total_price: 100, status: 'Confirmed' }];
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
    };
    process.env.DATABASE_URL = 'postgres://test:test@localhost/test';
  });

  it('should return 405 for unsupported methods', async () => {
    req = { method: 'PUT' };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return 200 and list of bookings for GET', async () => {
    req = { method: 'GET' };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should return 400 for invalid POST data (missing fields)', async () => {
    req = {
      method: 'POST',
      body: { date: '24' },
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Validation failed' }));
  });

  it('should return 200 for valid POST data', async () => {
    req = {
      method: 'POST',
      body: {
        date: 24,
        time: '10:30 AM',
        carModel: 'Tesla Model 3',
        packageName: 'Ceramic Coating',
        totalPrice: 499.00,
      },
    };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking saved successfully' });
  });
});
