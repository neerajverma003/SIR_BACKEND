const Testimonial = require('../models/Testimonial');
const { uploadProfileImageBuffer } = require('../config/cloudinary');

const listTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

const createTestimonial = async (req, res) => {
  const { name, message, rating, showPublic } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  let profileImageUrl = "";

  try {
    if (req.file?.buffer) {
      const safeName = sanitizeName(name) || 'anonymous';
      const folder = `TextTestimonials/${safeName}/profile`;
      const fileName = `profile_${Date.now()}`;

      const uploadResult = await uploadProfileImageBuffer({
        buffer: req.file.buffer,
        folder,
        fileName,
      });

      profileImageUrl = uploadResult.secure_url || "";
    }

    const item = await Testimonial.create({
      name,
      message,
      rating: rating || 5,
      showPublic: showPublic ?? true,
      profileImage: profileImageUrl,
    });
    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create testimonial:', err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

const toggleVerifyTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Testimonial.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    item.verified = !item.verified;
    await item.save();
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to toggle testimonial verification:', err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Testimonial.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to delete testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

module.exports = {
  listTestimonials,
  createTestimonial,
  toggleVerifyTestimonial,
  deleteTestimonial,
};
