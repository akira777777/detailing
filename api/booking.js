import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  time: z.string(),
  carModel: z.string().min(1, "Car model is required"),
  packageName: z.string().min(1, "Package name is required"),
  totalPrice: z.number().positive("Total price must be positive"),
});

export default async function handler(request, response) {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing');
    return response.status(500).json({ error: 'Server configuration error' });
  }

  const sql = neon(process.env.DATABASE_URL);

  if (request.method === 'GET') {
    try {
      const { limit = '10', offset = '0', search = '' } = request.query || {};
      const limitVal = parseInt(limit);
      const offsetVal = parseInt(offset);

      let bookings;
      let total;

      if (search) {
        const searchPattern = `%${search}%`;
        bookings = await sql`
          SELECT
            id,
            date::text,
            time,
            car_model,
            package,
            total_price,
            status,
            created_at
          FROM bookings
          WHERE car_model ILIKE ${searchPattern} OR package ILIKE ${searchPattern}
          ORDER BY date DESC, time DESC
          LIMIT ${limitVal}
          OFFSET ${offsetVal}
        `;

        const countResult = await sql`
          SELECT COUNT(*) FROM bookings
          WHERE car_model ILIKE ${searchPattern} OR package ILIKE ${searchPattern}
        `;
        total = parseInt(countResult[0].count);
      } else {
        bookings = await sql`
          SELECT
            id,
            date::text,
            time,
            car_model,
            package,
            total_price,
            status,
            created_at
          FROM bookings
          ORDER BY date DESC, time DESC
          LIMIT ${limitVal}
          OFFSET ${offsetVal}
        `;

        const countResult = await sql`SELECT COUNT(*) FROM bookings`;
        total = parseInt(countResult[0].count);
      }

      return response.status(200).json({
        data: bookings,
        total
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return response.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  if (request.method === 'POST') {
    try {
      const validatedData = bookingSchema.parse(request.body);
      const { date, time, carModel, packageName, totalPrice } = validatedData;

      const result = await sql`
        INSERT INTO bookings (date, time, car_model, package, total_price)
        VALUES (${date}, ${time}, ${carModel}, ${packageName}, ${totalPrice})
        RETURNING id
      `;

      console.log(`New booking created with ID: ${result[0].id}`);
      return response.status(201).json({
        message: 'Booking confirmed successfully',
        id: result[0].id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          error: 'Invalid booking data',
          details: error.issues ? error.issues.map(e => e.message) : [error.message]
        });
      }
      console.error('Error creating booking:', error);
      return response.status(500).json({ error: 'Failed to save booking' });
    }
  }

  if (response.setHeader) {
    response.setHeader('Allow', ['GET', 'POST']);
  }
  return response.status(405).json({ error: `Method ${request.method} Not Allowed` });
}
