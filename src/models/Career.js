const mongoose = require('mongoose');
const { toJSONPlugin, autoSlNo } = require('./plugins');

// Mirrors the Career interface in the admin panel's lib/types.ts.
const careerSchema = new mongoose.Schema(
  {
    slNo: { type: Number },
    title: { type: String, required: true, trim: true },
    slug: { type: String, default: '', index: true },
    department: { type: String, default: '' },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    location: { type: String, default: '' },
    experience: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

toJSONPlugin(careerSchema);
autoSlNo(careerSchema);

module.exports = mongoose.model('Career', careerSchema);
