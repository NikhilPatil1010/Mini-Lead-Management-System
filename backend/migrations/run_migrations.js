const fs = require('fs');
const path = require('path');
const db = require('../src/db');
const logger = require('../src/utils/logger');

async function runMigrations() {
  const client = await db.getClient();
  try {
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      logger.info(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sql);
      logger.info(`Completed: ${file}`);
    }

    logger.info('All migrations completed successfully');
  } catch (err) {
    logger.error('Migration failed', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

runMigrations();
