const VideoTestimonial = require('../models/VideoTestimonial');
const { uploadMediaBuffer, cloudinary } = require('../config/cloudinary');

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

const listVideoTestimonials = async (req, res) => {
  try {
    const items = await VideoTestimonial.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch video testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch video testimonials' });
  }
};

const createVideoTestimonial = async (req, res) => {
  const { title, showPublic } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'Video file is required' });
  }

  try {
    const safeTitle = sanitizeName(title) || 'video_testimonial';
    const folder = `VideoTestimonials/${safeTitle}`;
    const fileName = `video_${Date.now()}`;

    const uploadResult = await uploadMediaBuffer({
      buffer: req.file.buffer,
      folder,
      fileName,
      resourceType: 'video',
    });

    const item = await VideoTestimonial.create({
      title,
      showPublic: showPublic !== undefined ? showPublic === 'true' || showPublic === true : true,
      videoUrl: uploadResult.secure_url || '',
      cloudinaryId: uploadResult.public_id || '',
    });

    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create video testimonial:', err);
    res.status(500).json({ error: 'Failed to create video testimonial' });
  }
};

const deleteVideoTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await VideoTestimonial.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Video testimonial not found' });
    }

    // Attempt to delete from Cloudinary if we have the public id.
    if (item.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(item.cloudinaryId, { resource_type: 'video' });
      } catch (destroyErr) {
        console.warn('Failed to delete video from Cloudinary:', destroyErr.message || destroyErr);
      }
    }

    await item.deleteOne();
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to delete video testimonial:', err);
    res.status(500).json({ error: 'Failed to delete video testimonial' });
  }
};

module.exports = {
  listVideoTestimonials,
  createVideoTestimonial,
  deleteVideoTestimonial,
};
