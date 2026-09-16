const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/leads   (optional ?status=)
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json(leads);
});

// GET /api/leads/stats
exports.stats = asyncHandler(async (req, res) => {
  const rows = await Lead.aggregate([
    { $group: { _id: '$status', n: { $sum: 1 } } },
  ]);
  const by = Object.fromEntries(rows.map((r) => [r._id, r.n]));
  res.json({
    new: by.new || 0,
    overdue: by.overdue || 0,
    today: by.today || 0,
    followup: by.followup || 0,
    inprocess: by.inprocess || 0,
    converted: by.converted || 0,
    dead: by.dead || 0,
    total: Object.values(by).reduce((a, b) => a + b, 0),
  });
});

// GET /api/leads/:id
exports.getOne = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
});

// POST /api/leads
exports.create = asyncHandler(async (req, res) => {
  const lead = await Lead.create(req.body);
  res.status(201).json(lead);
});

// PUT /api/leads/:id
exports.update = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
});

// DELETE /api/leads/:id
exports.remove = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ message: 'Lead deleted' });
});

// POST /api/leads/:id/notes   { text, author }
exports.addNote = asyncHandler(async (req, res) => {
  const { text, author = 'Admin' } = req.body;
  if (!text) return res.status(400).json({ message: 'Note text is required' });

  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });

  lead.notes.push({ text, author, createdAt: new Date().toISOString() });
  await lead.save();
  res.json(lead);
});
