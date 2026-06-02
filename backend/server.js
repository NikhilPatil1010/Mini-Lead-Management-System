const config = require('./src/config');
const app = require('./src/app');
const db = require('./src/db');
const logger = require('./src/utils/logger');

const start = async () => {
  try {
    await db.connect();
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
