const Career = require('../models/Career');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/careers          (admin — all)
exports.list = asyncHandler(async (req, res) => {
  const careers = await Career.find().sort({ createdAt: -1 });
  res.json(careers);
});

// GET /api/careers/open     (public — for the website)
exports.listOpen = asyncHandler(async (req, res) => {
  const careers = await Career.find({ status: 'open' }).sort({ createdAt: -1 });
  res.json(careers);
});

// GET /api/careers/:idOrSlug
exports.getOne = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const career = await Career.findOne(query);
  if (!career) return res.status(404).json({ message: 'Career not found' });
  res.json(career);
});

// POST /api/careers
exports.create = asyncHandler(async (req, res) => {
  const career = await Career.create(req.body);
  res.status(201).json(career);
});

// PUT /api/careers/:id
exports.update = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!career) return res.status(404).json({ message: 'Career not found' });
  res.json(career);
});

// DELETE /api/careers/:id
exports.remove = asyncHandler(async (req, res) => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) return res.status(404).json({ message: 'Career not found' });
  res.json({ message: 'Career deleted' });
});
