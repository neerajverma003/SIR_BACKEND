const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    guests: { type: String, required: true },
    phones: { type: String, required: true },
    roomType: { type: String, required: true },
    roomNumber: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    status: {
      type: String,
      enum: ['Booked', 'Checked In', 'Checked Out', 'Cancelled'],
      default: 'Booked',
    },
    amount: { type: String, default: '' },
    documents: {
      aadhar: {
        url: { type: String, default: '' },
        cloudinaryId: { type: String, default: '' },
      },
      drivingLicense: {
        url: { type: String, default: '' },
        cloudinaryId: { type: String, default: '' },
      },
      electionCard: {
        url: { type: String, default: '' },
        cloudinaryId: { type: String, default: '' },
      },
      passport: {
        url: { type: String, default: '' },
        cloudinaryId: { type: String, default: '' },
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Booking', BookingSchema);
