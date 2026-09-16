const mongoose = require('mongoose');
const { toJSONPlugin, autoSlNo } = require('./plugins');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: true }
);

// A lead is exactly the website "Tell us about your business" form:
// name, email, phone, company, team size — plus a simple status the admin
// moves through, and notes.
const leadSchema = new mongoose.Schema(
  {
    slNo: { type: Number },
    date: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    mobileNumber: { type: String, default: '' }, // Phone
    company: { type: String, default: '' },
    teamSize: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'overdue', 'today', 'followup', 'inprocess', 'converted', 'dead'],
      default: 'new',
    },
    followUpDate: { type: String, default: '' },
    notes: { type: [noteSchema], default: [] },
    // where the lead came from (website landing page, or "manual")
    source: { type: String, default: '' },
    leadType: { type: String, enum: ['website', 'manual'], default: 'manual' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

toJSONPlugin(leadSchema);
autoSlNo(leadSchema);

module.exports = mongoose.model('Lead', leadSchema);
