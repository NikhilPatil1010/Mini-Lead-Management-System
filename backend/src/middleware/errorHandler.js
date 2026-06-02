const logger = require('../utils/logger');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    error: config.nodeEnv === 'production' ? null : err.message,
  });
};

module.exports = errorHandler;
