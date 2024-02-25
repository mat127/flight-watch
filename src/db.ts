import { Pool } from 'pg'

export const db= {
  pool: createPool()
};

function createPool() {
  if(process.env.DB_URL === undefined) {
    throw new Error('DB_URL is not defined');
  }
  return new Pool({
    connectionString: process.env.DB_URL
  });
}
