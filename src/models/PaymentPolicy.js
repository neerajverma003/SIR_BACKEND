const mongoose = require('mongoose');

const PaymentPolicySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['domestic', 'international'],
      required: true,
      unique: true,
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PaymentPolicy', PaymentPolicySchema);
