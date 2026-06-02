const { Pool } = require('pg');
const config = require('../config');
const logger = require('../utils/logger');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Using pool.query directly handles checkout, execute, and release
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result; // pg already returns an object with { rows, rowCount, ... }
};

const connect = async () => {
  try {
    const client = await pool.connect();
    logger.info('Database connected successfully (PostgreSQL)');
    client.release();
  } catch (err) {
    logger.error('Failed to connect to database', err);
    process.exit(-1);
  }
};

// getClient returns a dedicated connection for transactions
const getClient = async () => {
  const client = await pool.connect();
  return client; // client.query and client.release are natively available in pg
};

module.exports = { pool, query, connect, getClient };
