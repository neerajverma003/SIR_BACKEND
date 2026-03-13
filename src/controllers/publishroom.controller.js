const PublishRoom = require('../models/publishroom.model');
const { uploadProfileImageBuffer, cloudinary } = require('../config/cloudinary');

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

const listPublishRooms = async (req, res) => {
  try {
    const items = await PublishRoom.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch publish rooms:', err);
    res.status(500).json({ error: 'Failed to fetch publish rooms' });
  }
};

const getPublishRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await PublishRoom.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Publish room not found' });
    }
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to fetch publish room:', err);
    res.status(500).json({ error: 'Failed to fetch publish room' });
  }
};

const createPublishRoom = async (req, res) => {
  const { name, overview, price, rating, guests, amenities } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  try {
    const safeName = sanitizeName(name) || 'publish room';

    let mainImage = { url: '', cloudinaryId: '' };
    if (req.files?.mainImage?.[0]?.buffer) {
      const folder = `publish room/${safeName}/main`;
      const fileName = `main_${Date.now()}`;
      const uploadResult = await uploadProfileImageBuffer({
        buffer: req.files.mainImage[0].buffer,
        folder,
        fileName,
      });

      mainImage = {
        url: uploadResult.secure_url || '',
        cloudinaryId: uploadResult.public_id || '',
      };
    }

    const gallery = [];
    if (req.files?.gallery?.length) {
      const folder = `publish room/${safeName}/gallery`;
      const uploads = req.files.gallery.map((file, index) => {
        const fileName = `gallery_${Date.now()}_${index}`;
        return uploadProfileImageBuffer({
          buffer: file.buffer,
          folder,
          fileName,
        });
      });

      const results = await Promise.all(uploads);
      results.forEach((result) => {
        if (result?.secure_url) {
          gallery.push({
            url: result.secure_url,
            cloudinaryId: result.public_id,
          });
        }
      });
    }

    const item = await PublishRoom.create({
      name,
      overview: overview || '',
      price: price || '',
      rating: Number(rating) || 0,
      guests: Number(guests) || 0,
      amenities: Array.isArray(amenities) ? amenities : [],
      mainImage,
      gallery,
    });

    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create publish room:', err);
    res.status(500).json({ error: 'Failed to create publish room' });
  }
};

const updatePublishRoom = async (req, res) => {
  const { id } = req.params;
  const { name, overview, price, rating, guests, amenities } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  try {
    const item = await PublishRoom.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Publish room not found' });
    }

    const safeName = sanitizeName(name) || 'publish room';

    item.name = name;
    item.overview = overview || '';
    item.price = price || '';
    item.rating = Number(rating) || 0;
    item.guests = Number(guests) || 0;
    item.amenities = Array.isArray(amenities) ? amenities : [];

    if (req.files?.mainImage?.[0]?.buffer) {
      if (item.mainImage?.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(item.mainImage.cloudinaryId, {
            resource_type: 'image',
          });
        } catch (destroyErr) {
          console.warn('Failed to delete old main image from Cloudinary:', destroyErr.message || destroyErr);
        }
      }

      const folder = `publish room/${safeName}/main`;
      const fileName = `main_${Date.now()}`;
      const uploadResult = await uploadProfileImageBuffer({
        buffer: req.files.mainImage[0].buffer,
        folder,
        fileName,
      });

      item.mainImage = {
        url: uploadResult.secure_url || '',
        cloudinaryId: uploadResult.public_id || '',
      };
    }

    if (req.files?.gallery?.length) {
      const folder = `publish room/${safeName}/gallery`;
      const uploads = req.files.gallery.map((file, index) => {
        const fileName = `gallery_${Date.now()}_${index}`;
        return uploadProfileImageBuffer({
          buffer: file.buffer,
          folder,
          fileName,
        });
      });

      const results = await Promise.all(uploads);
      results.forEach((result) => {
        if (result?.secure_url) {
          item.gallery.push({
            url: result.secure_url,
            cloudinaryId: result.public_id,
          });
        }
      });
    }

    await item.save();

    res.json({ data: item });
  } catch (err) {
    console.error('Failed to update publish room:', err);
    res.status(500).json({ error: 'Failed to update publish room' });
  }
};

const deletePublishRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await PublishRoom.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Publish room not found' });
    }

    if (item.mainImage?.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(item.mainImage.cloudinaryId, {
          resource_type: 'image',
        });
      } catch (destroyErr) {
        console.warn('Failed to delete main image from Cloudinary:', destroyErr.message || destroyErr);
      }
    }

    if (Array.isArray(item.gallery)) {
      await Promise.all(
        item.gallery.map((media) =>
          media.cloudinaryId
            ? cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: 'image' })
            : Promise.resolve()
        )
      );
    }

    await item.deleteOne();
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to delete publish room:', err);
    res.status(500).json({ error: 'Failed to delete publish room' });
  }
};

module.exports = {
  listPublishRooms,
  getPublishRoom,
  createPublishRoom,
  updatePublishRoom,
  deletePublishRoom,
};
