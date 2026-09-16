const mongoose = require('mongoose');

// Cache the connection across (warm) serverless invocations so we don't open a
// new connection on every request. On Vercel each function reuses this module
// scope while warm; `global` keeps it alive across hot reloads too.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function connectDB() {
  // Reuse a live connection.
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set — check environment variables');

    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 8000,
        // We await the connection before running any query (see app.js), so we
        // don't rely on command buffering to bridge the gap.
        bufferCommands: false,
      })
      .then((m) => {
        console.log(`✓ MongoDB connected: ${m.connection.host}/${m.connection.name}`);
        cached.conn = m;
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset so the next request retries
    throw err;
  }
  return cached.conn;
}

module.exports = connectDB;
