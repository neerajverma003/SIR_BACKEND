const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    arrivalDate: { type: String, required: true },
    departureDate: { type: String, required: true },
    adults: { type: Number, required: true, default: 1 },
    children: { type: Number, required: true, default: 0 },
    totalPersons: { type: Number, required: true, default: 1 },
    roomType: { type: String, required: true },
    rooms: { type: Number, required: true, default: 1 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Reservation', ReservationSchema);
