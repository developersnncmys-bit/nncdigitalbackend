// Wraps an async route handler so thrown/rejected errors reach the Express
// error middleware instead of crashing the process.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
