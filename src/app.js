const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────
// Reflect the request origin so the API is reachable from the website, the
// admin panel (any Vercel/preview URL), and localhost. Auth is by Bearer token
// (not cookies), so reflecting all origins is safe here and avoids brittle
// allowlist maintenance. `origin: true` echoes the caller's Origin header.
app.use(cors({ origin: true, credentials: true }));
// Make sure preflight (OPTIONS) requests are answered for every route.
app.options('*', cors({ origin: true, credentials: true }));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ name: 'NNC Digital API', status: 'running' }));

// Ensure the DB is connected before handling any data route (lazy + cached).
// Health check is exempt so it works even while the DB is unreachable.
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      message: 'Database unavailable. If this persists, whitelist this server\'s IP (0.0.0.0/0) in MongoDB Atlas → Network Access.',
    });
  }
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
