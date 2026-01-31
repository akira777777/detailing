import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { date, time, carModel, packageName, totalPrice } = request.body;

  if (!process.env.DATABASE_URL) {
    return response.status(500).json({ error: 'DATABASE_URL is not defined' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Insert booking into Neon DB
    await sql`
      INSERT INTO bookings (date, time, car_model, package, total_price)
      VALUES (${date}, ${time}, ${carModel}, ${packageName}, ${totalPrice})
    `;

    return response.status(200).json({ message: 'Booking saved successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return response.status(500).json({ error: 'Failed to save booking', details: error.message });
  }
}
