const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/blogs            (admin — all blogs)
exports.list = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// GET /api/blogs/published  (public — for the website)
exports.listPublished = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
  res.json(blogs);
});

// GET /api/blogs/:idOrSlug
exports.getOne = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const blog = await Blog.findOne(query);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

// POST /api/blogs
exports.create = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
});

// PUT /api/blogs/:id
exports.update = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

// DELETE /api/blogs/:id
exports.remove = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
});
