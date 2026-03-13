const Guest = require('../models/Guest');

const listGuests = async (req, res) => {
  try {
    const items = await Guest.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch guests:', err);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
};

const createGuest = async (req, res) => {
  try {
    const payload = {
      guests: String(req.body.guests || '').trim(),
      phones: String(req.body.phones || '').trim(),
      roomType: String(req.body.roomType || '').trim(),
      roomNumber: String(req.body.roomNumber || '').trim(),
      checkIn: String(req.body.checkIn || '').trim(),
      checkOut: String(req.body.checkOut || '').trim(),
      status: String(req.body.status || 'Checked Out').trim(),
      amount: String(req.body.amount || '').trim(),
      documents: req.body.documents || {},
      sourceBookingId: req.body.sourceBookingId,
    };

    const item = await Guest.create(payload);
    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create guest:', err);
    const message = err?.message || 'Failed to create guest';
    const details = err?.errors
      ? Object.values(err.errors)
          .map((e) => e.message)
          .join(' | ')
      : undefined;
    res.status(500).json({ error: message, details });
  }
};

module.exports = {
  listGuests,
  createGuest,
};
