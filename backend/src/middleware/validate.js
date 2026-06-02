const { ZodError } = require('zod');
const { sendResponse } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return sendResponse(res, 422, false, null, 'Validation failed', fieldErrors);
    }
    next(err);
  }
};

module.exports = validate;
