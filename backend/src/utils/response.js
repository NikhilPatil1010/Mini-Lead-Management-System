const sendResponse = (res, statusCode, success, data, message, error = null) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    ...(error && { error }),
  });
};

module.exports = {
  sendResponse,
};
