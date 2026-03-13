const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const { uploadProfileImageBuffer, cloudinary } = require('../config/cloudinary');

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '');
}

const listBookings = async (req, res) => {
  try {
    // Only show active bookings (exclude checked out / cancelled since those are moved to Guests)
    const items = await Booking.find({
      status: { $nin: ['Checked Out', 'Cancelled'] },
    }).sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const createBooking = async (req, res) => {
  try {
    const guests = String(req.body.guests || '').trim();
    const phones = String(req.body.phones || '').trim();
    const roomType = String(req.body.roomType || '').trim();
    const roomNumber = String(req.body.roomNumber || '').trim();
    const checkIn = String(req.body.checkIn || '').trim();
    const checkOut = String(req.body.checkOut || '').trim();
    const status = String(req.body.status || 'Booked').trim();
    const amount = String(req.body.amount || '').trim();

    const safeName = sanitizeName(guests || phones || 'guest');

    const documents = {};
    const documentFields = [
      'aadhar',
      'drivingLicense',
      'electionCard',
      'passport',
    ];

    for (const field of documentFields) {
      const file = req.files?.[field]?.[0];
      if (file && file.buffer) {
        const folder = `document/${safeName}/${field}`;
        const fileName = `${field}_${Date.now()}`;
        try {
          const uploadResult = await uploadProfileImageBuffer({
            buffer: file.buffer,
            folder,
            fileName,
          });
          documents[field] = {
            url: uploadResult.secure_url || '',
            cloudinaryId: uploadResult.public_id || '',
          };
        } catch (uploadErr) {
          console.warn(`Failed to upload ${field} document:`, uploadErr);
        }
      }
    }

    const payload = {
      guests,
      phones,
      roomType,
      roomNumber,
      checkIn,
      checkOut,
      status,
      amount,
      documents,
    };

    const item = await Booking.create(payload);
    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create booking:', err);
    const message = err?.message || 'Failed to create booking';
    const details = err?.errors
      ? Object.values(err.errors)
          .map((e) => e.message)
          .join(' | ')
      : undefined;
    res.status(500).json({ error: message, details });
  }
};

const updateBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Booking.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const guests = String(req.body.guests || item.guests || '').trim();
    const phones = String(req.body.phones || item.phones || '').trim();
    const roomType = String(req.body.roomType || item.roomType || '').trim();
    const roomNumber = String(req.body.roomNumber || item.roomNumber || '').trim();
    const checkIn = String(req.body.checkIn || item.checkIn || '').trim();
    const checkOut = String(req.body.checkOut || item.checkOut || '').trim();
    const status = String(req.body.status || item.status || 'Booked').trim();
    const amount = String(req.body.amount || item.amount || '').trim();

    const safeName = sanitizeName(guests || phones || item.guests || item.phones || 'guest');

    const existingDocs = item.documents || {};
    const documentFields = ['aadhar', 'drivingLicense', 'electionCard', 'passport'];

    const documents = {};
    for (const field of documentFields) {
      const existing = existingDocs[field];
      if (existing && typeof existing === 'object') {
        documents[field] = {
          url: existing.url ? String(existing.url) : '',
          cloudinaryId: existing.cloudinaryId ? String(existing.cloudinaryId) : '',
        };
      } else {
        documents[field] = { url: '', cloudinaryId: '' };
      }
    }

    for (const field of documentFields) {
      const removeFlag =
        String(req.body[`remove_${field}`] || '').toLowerCase() === 'true';
      const file = req.files?.[field]?.[0];

      if (removeFlag) {
        if (documents[field]?.cloudinaryId) {
          try {
            await cloudinary.uploader.destroy(documents[field].cloudinaryId, {
              resource_type: 'image',
            });
          } catch (destroyErr) {
            console.warn(`Failed to delete removed ${field} document:`, destroyErr);
          }
        }
        documents[field] = { url: '', cloudinaryId: '' };
      }

      if (file && file.buffer) {
        if (documents[field]?.cloudinaryId) {
          try {
            await cloudinary.uploader.destroy(documents[field].cloudinaryId, {
              resource_type: 'image',
            });
          } catch (destroyErr) {
            console.warn(`Failed to delete old ${field} document:`, destroyErr);
          }
        }

        const folder = `document/${safeName}/${field}`;
        const fileName = `${field}_${Date.now()}`;
        try {
          const uploadResult = await uploadProfileImageBuffer({
            buffer: file.buffer,
            folder,
            fileName,
          });
          documents[field] = {
            url: uploadResult.secure_url || '',
            cloudinaryId: uploadResult.public_id || '',
          };
        } catch (uploadErr) {
          console.warn(`Failed to upload ${field} document:`, uploadErr);
        }
      }
    }

    const payload = {
      guests,
      phones,
      roomType,
      roomNumber,
      checkIn,
      checkOut,
      status,
      amount,
      documents,
    };

    const previousStatus = item.status;

    Object.assign(item, payload);
    await item.save();

    // If booking is completed/cancelled, move it to Guests and remove from bookings.
    if (
      ['Checked Out', 'Cancelled'].includes(status) &&
      !['Checked Out', 'Cancelled'].includes(previousStatus)
    ) {
      try {
        const guest = await Guest.create({
          ...payload,
          sourceBookingId: item._id,
        });
        await item.deleteOne();
        return res.json({ data: null, movedToGuests: true, guest });
      } catch (guestErr) {
        console.warn('Failed to move booking to guests:', guestErr);
        // Even if guest creation fails, return the updated booking.
      }
    }

    res.json({ data: item });
  } catch (err) {
    console.error('Failed to update booking:', err);
    const message = err?.message || 'Failed to update booking';
    const details = err?.errors
      ? Object.values(err.errors)
          .map((e) => e.message)
          .join(' | ')
      : undefined;
    res.status(500).json({ error: message, details });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Booking.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await item.deleteOne();
    res.json({ data: item });
  } catch (err) {
    console.error('Failed to delete booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

module.exports = {
  listBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
