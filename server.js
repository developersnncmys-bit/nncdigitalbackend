require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const seedAdmin = require('./src/seed');

const PORT = process.env.PORT || 5000;

// Start the HTTP server immediately so the API stays reachable even if MongoDB
// is briefly unavailable (e.g. Atlas IP not yet whitelisted, transient TLS
// blip). We then connect to the DB with retries in the background.
app.listen(PORT, () => {
  console.log(`✓ NNC Digital API listening on http://localhost:${PORT}`);
});

async function connectWithRetry(attempt = 1) {
  try {
    await connectDB();
    await seedAdmin(); // creates default admin on first run only
  } catch (err) {
    const wait = Math.min(30, attempt * 5);
    console.error(`✗ MongoDB connection failed (attempt ${attempt}): ${err.message}`);
    console.error(`  Retrying in ${wait}s. If this persists, whitelist your IP in MongoDB Atlas → Network Access.`);
    setTimeout(() => connectWithRetry(attempt + 1), wait * 1000);
  }
}

connectWithRetry();
