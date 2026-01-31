import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.union([z.string(), z.number()]).transform(val => val.toString()),
  time: z.string(),
  carModel: z.string(),
  packageName: z.string(),
  totalPrice: z.number(),
});

export default async function handler(request, response) {
  if (!process.env.DATABASE_URL) {
    return response.status(500).json({ error: 'DATABASE_URL is not defined' });
  }

  const sql = neon(process.env.DATABASE_URL);

  if (request.method === 'GET') {
    try {
      const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return response.status(200).json(bookings);
    } catch (error) {
      console.error('Database error (GET):', error);
      return response.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const validatedData = bookingSchema.parse(request.body);
      const { date, time, carModel, packageName, totalPrice } = validatedData;

      await sql`
        INSERT INTO bookings (date, time, car_model, package, total_price)
        VALUES (${date}, ${time}, ${carModel}, ${packageName}, ${totalPrice})
      `;

      return response.status(200).json({ message: 'Booking saved successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Database error (POST):', error);
      return response.status(500).json({ error: 'Failed to save booking', details: error.message });
    }
  }

  return response.status(405).json({ error: 'Method Not Allowed' });
}
