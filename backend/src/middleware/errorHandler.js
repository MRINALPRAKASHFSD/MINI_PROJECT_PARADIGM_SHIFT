function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const status = err.statusCode || err.status || 500;

  // Avoid leaking internal details in production (simple approach)
  const message = status >= 500 ? "Internal Server Error" : err.message;

  if (process.env.NODE_ENV !== "production") {
    // helpful dev logging
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
}

module.exports = { errorHandler };
