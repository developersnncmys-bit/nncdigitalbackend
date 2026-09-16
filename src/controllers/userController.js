const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users
exports.list = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ slNo: 1 });
  res.json(users);
});

// GET /api/users/:id
exports.getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST /api/users
exports.create = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await User.create(req.body); // pre-save hook hashes the password
  res.status(201).json(user);
});

// PUT /api/users/:id
exports.update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Assign fields; only touch password if a new non-empty one was sent, so the
  // pre-save hook re-hashes it.
  const { password, ...rest } = req.body;
  Object.assign(user, rest);
  if (password) user.password = password;

  await user.save();
  res.json(user);
});

// DELETE /api/users/:id
exports.remove = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});
