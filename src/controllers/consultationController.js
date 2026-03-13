const ConsultationRequest = require('../models/ConsultationRequest');

const createConsultationRequest = async (req, res) => {
  const { name, phone, email, state, city, checkIn, checkOut, guests, roomId } = req.body;

  if (!name || !phone || !email || !state || !city || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const item = await ConsultationRequest.create({
      name,
      phone,
      email,
      state,
      city,
      checkIn,
      checkOut,
      guests,
      roomId,
    });
    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create consultation request:', err);
    res.status(500).json({ error: 'Failed to submit consultation request' });
  }
};

const listConsultationRequests = async (req, res) => {
  try {
    const items = await ConsultationRequest.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch consultation requests:', err);
    res.status(500).json({ error: 'Failed to fetch consultation requests' });
  }
};

module.exports = {
  createConsultationRequest,
  listConsultationRequests,
};
