require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const seedAdmin = require('./src/seed');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    await seedAdmin(); // creates default admin on first run only
    app.listen(PORT, () => {
      console.log(`✓ NNC Digital API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
