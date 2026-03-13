const mongoose = require('mongoose');

const consultationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    checkIn: { type: String, required: true, trim: true },
    checkOut: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    roomId: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ConsultationRequest', consultationRequestSchema);
