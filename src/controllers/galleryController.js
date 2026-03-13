const CustomerGalleryImage = require('../models/CustomerGalleryImage');
const { uploadProfileImageBuffer, cloudinary } = require('../config/cloudinary');

const MAX_UPLOADS = 50;

const listGalleryImages = async (req, res) => {
  try {
    const items = await CustomerGalleryImage.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch gallery images:', err);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
};

const uploadGalleryImages = async (req, res) => {
  const files = req.files || [];

  if (!files.length) {
    return res.status(400).json({ error: 'No images provided' });
  }

  if (files.length > MAX_UPLOADS) {
    return res.status(400).json({ error: `You can upload up to ${MAX_UPLOADS} images at once.` });
  }

  try {
    const savedItems = [];

    for (const file of files) {
      const now = Date.now();
      const folder = `customergellary tesimonial/images`;
      const fileName = `image_${now}_${Math.random().toString(36).substring(2, 8)}`;

      const uploadResult = await uploadProfileImageBuffer({
        buffer: file.buffer,
        folder,
        fileName,
      });

      const item = await CustomerGalleryImage.create({
        imageUrl: uploadResult.secure_url || '',
        cloudinaryId: uploadResult.public_id || '',
      });
      savedItems.push(item);
    }

    res.status(201).json({ data: savedItems });
  } catch (err) {
    console.error('Failed to upload gallery images:', err);
    res.status(500).json({ error: 'Failed to upload gallery images' });
  }
};

const deleteGalleryImages = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'ids must be an array' });
  }

  try {
    const deleted = [];

    for (const id of ids) {
      const item = await CustomerGalleryImage.findById(id);
      if (!item) continue;

      if (item.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(item.cloudinaryId, { resource_type: 'image' });
        } catch (destroyErr) {
          console.warn('Failed to delete gallery image from Cloudinary:', destroyErr.message || destroyErr);
        }
      }

      await item.deleteOne();
      deleted.push(id);
    }

    res.json({ data: { deleted } });
  } catch (err) {
    console.error('Failed to delete gallery images:', err);
    res.status(500).json({ error: 'Failed to delete gallery images' });
  }
};

module.exports = {
  listGalleryImages,
  uploadGalleryImages,
  deleteGalleryImages,
};
