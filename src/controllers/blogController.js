const Blog = require('../models/Blog');
const { uploadProfileImageBuffer } = require('../config/cloudinary');

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

const listBlogs = async (req, res) => {
  try {
    const items = await Blog.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

const createBlog = async (req, res) => {
  const { title, visibility, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    let coverImageUrl = '';
    let coverImageCloudinaryId = '';

    if (req.file && req.file.buffer) {
      const safeTitle = sanitizeName(title) || 'blog';
      const folder = `blogs/${safeTitle}/image`;
      const fileName = `cover_${Date.now()}`;

      const uploadResult = await uploadProfileImageBuffer({
        buffer: req.file.buffer,
        folder,
        fileName,
      });

      coverImageUrl = uploadResult.secure_url || '';
      coverImageCloudinaryId = uploadResult.public_id || '';
    }

    const item = await Blog.create({
      title,
      visibility: visibility === 'public' ? 'public' : 'private',
      content: content || '',
      coverImageUrl,
      coverImageCloudinaryId,
    });

    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create blog:', err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, visibility, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const item = await Blog.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    item.title = title;
    item.visibility = visibility === 'public' ? 'public' : 'private';
    item.content = content || '';

    if (req.file && req.file.buffer) {
      if (item.coverImageCloudinaryId) {
        try {
          const { cloudinary } = require('../config/cloudinary');
          await cloudinary.uploader.destroy(item.coverImageCloudinaryId, { resource_type: 'image' });
        } catch (destroyErr) {
          console.warn('Failed to delete old cover image from Cloudinary:', destroyErr.message || destroyErr);
        }
      }

      const safeTitle = sanitizeName(title) || 'blog';
      const folder = `blogs/${safeTitle}/image`;
      const fileName = `cover_${Date.now()}`;

      const uploadResult = await uploadProfileImageBuffer({
        buffer: req.file.buffer,
        folder,
        fileName,
      });

      item.coverImageUrl = uploadResult.secure_url || '';
      item.coverImageCloudinaryId = uploadResult.public_id || '';
    }

    await item.save();

    res.json({ data: item });
  } catch (err) {
    console.error('Failed to update blog:', err);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Blog.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (item.coverImageCloudinaryId) {
      try {
        const { cloudinary } = require('../config/cloudinary');
        await cloudinary.uploader.destroy(item.coverImageCloudinaryId, { resource_type: 'image' });
      } catch (destroyErr) {
        console.warn('Failed to delete cover image from Cloudinary:', destroyErr.message || destroyErr);
      }
    }

    await item.deleteOne();
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to delete blog:', err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Blog.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ data: item });
  } catch (err) {
    console.error('Failed to fetch blog:', err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

module.exports = {
  listBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
