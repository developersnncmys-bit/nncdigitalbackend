// 404 for anything the routers didn't handle.
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error formatter. Turns Mongoose/validation errors into clean JSON.
function errorHandler(err, req, res, _next) {
  // eslint-disable-next-line no-console
  console.error('✗', err.message);

  let status = err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(', ')}`;
  }

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
