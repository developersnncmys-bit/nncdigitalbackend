require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

// Creates the default admin from the SEED_ADMIN_* env vars if the users
// collection is empty. Safe to call on every boot — it never overwrites.
async function seedAdmin() {
  const count = await User.countDocuments();
  if (count > 0) return null;

  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || 'Admin',
    username: process.env.SEED_ADMIN_USERNAME || 'admin',
    email: process.env.SEED_ADMIN_EMAIL || '',
    password: process.env.SEED_ADMIN_PASSWORD || 'admin123',
    role: 'admin',
    status: 'active',
  });

  console.log(
    `✓ Seeded default admin → username: "${admin.username}"  password: "${
      process.env.SEED_ADMIN_PASSWORD || 'admin123'
    }"`
  );
  return admin;
}

// Allow running standalone: `npm run seed`
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedAdmin();
      console.log('Seed complete.');
    } catch (err) {
      console.error(err);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  })();
}

module.exports = seedAdmin;
