import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

class Database {
  constructor(connectionString) {
    this.pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false, // This allows Node to connect to cloud DBs safely
        }
    });
  }

  async connect() {
    try {
      await this.pool.query('SELECT NOW() AS current_time');
      console.log('✅ Successfully connected to PostgreSQL!');
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      process.exit(1); 
    }
  }

  async disconnect() {
    try {
      await this.pool.end();
      console.log('🛑 PostgreSQL connection pool closed.');
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }
}

const db = new Database(process.env.DATABASE_URL);
const restrictedDb = new Database(process.env.WEBHOOK_DATABASE_URL);

export { db, restrictedDb };