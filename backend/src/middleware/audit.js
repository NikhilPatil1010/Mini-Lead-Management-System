const logger = require('../utils/logger');

const SENSITIVE_FIELDS = ['password', 'token', 'refreshToken', 'accessToken'];

const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const sanitized = { ...body };
  for (const field of SENSITIVE_FIELDS) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
};

const audit = (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (mutatingMethods.includes(req.method)) {
    logger.info('AUDIT', {
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.id || 'anonymous',
      ip: req.ip,
      timestamp: new Date().toISOString(),
      body: sanitizeBody(req.body),
    });
  }

  next();
};

module.exports = audit;
