import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ──────────────────────────────────────────────
// MySQL Connection Pool
// ──────────────────────────────────────────────
// Using a pool (not a single connection) for:
//   - Better concurrency handling
//   - Automatic reconnection
//   - Connection reuse
// ──────────────────────────────────────────────

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_profile_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Test the database connection on startup
 */
const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    const err = error as Error;
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
};

export { pool, testConnection };
