import postgres from 'postgres';
import { initDb } from './init-db';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nurture_health';

// Initialize the database client
export const sql = postgres(databaseUrl, {
  transform: postgres.camel,
  // Ensure we don't throw connection issues immediately if database is booting up
  connect_timeout: 5,
});

// Run initialization in the background
initDb(sql).catch((err) => {
  console.error('Failed to auto-initialize DB:', err);
});

export default sql;
