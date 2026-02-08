import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  time: z.string(),
  carModel: z.string().min(1, "Car model is required"),
  packageName: z.string().min(1, "Package name is required"),
  totalPrice: z.number().positive("Total price must be positive"),
});

// Initialize the SQL client outside the handler to leverage connection reuse
// across multiple warm invocations of the serverless function.
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export default async function handler(request, response) {
  if (!sql) {
    console.error('DATABASE_URL is missing');
    return response.status(500).json({ error: 'Server configuration error' });
  }

  if (request.method === 'GET') {
    try {
      const { limit = '10', offset = '0', search = '' } = request.query || {};

      // Validate and clamp pagination parameters to prevent invalid or overly large queries
      const limitVal = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
      const offsetVal = Math.max(0, parseInt(offset, 10) || 0);

      // Optimization: Use a single query to fetch both the total count (reflecting filters)
      // and the paginated data. This reduces round-trips to the database.
      // We use ILIKE for case-insensitive search on car model and package name.
      const searchPattern = search ? `%${search}%` : null;

      const result = await sql`
        SELECT
          (
            SELECT COUNT(*)
            FROM bookings
            WHERE (${searchPattern} IS NULL OR car_model ILIKE ${searchPattern} OR package ILIKE ${searchPattern})
          )::int AS total,
          (
            SELECT JSON_AGG(sub.*) FROM (
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
              WHERE (${searchPattern} IS NULL OR car_model ILIKE ${searchPattern} OR package ILIKE ${searchPattern})
              ORDER BY date DESC, time DESC
              LIMIT ${limitVal}
              OFFSET ${offsetVal}
            ) sub
          ) AS data
      `;

      const total = result[0]?.total || 0;
      const data = result[0]?.data || [];

      return response.status(200).json({
        data,
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

      const postResult = await sql`
        INSERT INTO bookings (date, time, car_model, package, total_price)
        VALUES (${date}, ${time}, ${carModel}, ${packageName}, ${totalPrice})
        RETURNING id
      `;

      console.log(`New booking created with ID: ${postResult[0].id}`);
      return response.status(201).json({
        message: 'Booking confirmed successfully',
        id: postResult[0].id
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
