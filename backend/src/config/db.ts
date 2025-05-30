import { Pool } from 'pg';
import { DATABASE_URL } from './env';

const pool = new Pool({
  connectionString: DATABASE_URL,
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Descomente para produção se o DB exigir SSL
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;