import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'detailing_db',
  user: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_ACQUIRE_TIMEOUT) || 60000,
  acquireTimeoutMillis: parseInt(process.env.DB_POOL_CREATE_TIMEOUT) || 30000,
  
  // Query settings
  query_timeout: 30000,
  statement_timeout: 30000,
  
  // Connection lifecycle events
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
};

// Create connection pool
export const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
export async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('🕒 Database time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
}

// Graceful shutdown
export async function closePool() {
  console.log('🔄 Closing database connection pool...');
  await pool.end();
  console.log('✅ Database connection pool closed');
}

// Export pool for direct usage
export default pool;