const { verifyToken } = require('../utils/token');

// Requires a valid "Authorization: Bearer <token>" header. Attaches req.user.
function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — invalid or expired token' });
  }
}

// Restricts a route to specific roles, e.g. adminOnly = restrictTo('admin').
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient permissions' });
    }
    next();
  };
}

module.exports = { protect, restrictTo };
