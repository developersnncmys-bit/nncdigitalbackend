const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────
// Allow the website + admin panel origins from CORS_ORIGINS. Requests with no
// Origin (curl, server-to-server, health checks) are allowed too.
const allowed = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ name: 'NNC Digital API', status: 'running' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
