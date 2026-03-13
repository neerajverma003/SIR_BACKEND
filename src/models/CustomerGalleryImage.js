const mongoose = require('mongoose');

const CustomerGalleryImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CustomerGalleryImage', CustomerGalleryImageSchema);
