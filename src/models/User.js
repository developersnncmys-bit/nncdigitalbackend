const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSONPlugin, autoSlNo } = require('./plugins');

// Mirrors the User interface in the admin panel's lib/types.ts.
const userSchema = new mongoose.Schema(
  {
    slNo: { type: Number },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false }, // bcrypt hash
    // Admin-only "show password" feature keeps the plain value alongside the hash.
    passwordPlain: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    phone: { type: String, default: '' },
    services: { type: [String], default: [] },
    states: { type: [String], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

// Hash the password whenever it changes, and stash the plain copy for the
// admin "show password" view.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.passwordPlain = this.password;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

toJSONPlugin(userSchema);
autoSlNo(userSchema);

module.exports = mongoose.model('User', userSchema);
