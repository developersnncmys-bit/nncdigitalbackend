const mongoose = require('mongoose');
const { toJSONPlugin, autoSlNo } = require('./plugins');

// Mirrors the Blog interface in the admin panel's lib/types.ts.
const blogSchema = new mongoose.Schema(
  {
    slNo: { type: Number },
    title: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    // website-facing fields
    category: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    slug: { type: String, default: '', index: true },
    readTime: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: false }
);

toJSONPlugin(blogSchema);
autoSlNo(blogSchema);

module.exports = mongoose.model('Blog', blogSchema);
