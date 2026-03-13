const Reservation = require('../models/Reservation');

const listReservations = async (req, res) => {
  try {
    const items = await Reservation.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch reservations:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

const createReservation = async (req, res) => {
  const {
    arrivalDate,
    departureDate,
    adults,
    children,
    totalPersons,
    roomType,
    rooms,
    name,
    email,
    phone,
  } = req.body;

  if (!arrivalDate || !departureDate || !roomType || !rooms || !name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required reservation fields' });
  }

  try {
    const item = await Reservation.create({
      arrivalDate,
      departureDate,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      totalPersons: Number(totalPersons) || (Number(adults) || 1) + (Number(children) || 0),
      roomType,
      rooms: Number(rooms) || 1,
      name,
      email,
      phone,
    });

    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create reservation:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

module.exports = {
  listReservations,
  createReservation,
};
