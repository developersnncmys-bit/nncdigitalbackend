const mongoose = require('mongoose');

// Single shared connection to MongoDB Atlas. Called once at boot from server.js.
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set — check backend/.env');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

module.exports = connectDB;
