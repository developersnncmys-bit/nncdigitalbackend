const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

// POST /api/auth/login  { username, password }
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // password has select:false, so pull it explicitly for the compare.
  const user = await User.findOne({ username: username.trim() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  if (user.status !== 'active') {
    return res.status(403).json({ message: 'This account is inactive. Contact your admin.' });
  }

  const token = signToken(user);
  res.json({ token, user: user.toJSON() });
});

// GET /api/auth/me   (requires token)
exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});
