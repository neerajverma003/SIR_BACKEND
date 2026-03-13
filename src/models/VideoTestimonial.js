const mongoose = require('mongoose');

const VideoTestimonialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    showPublic: {
      type: Boolean,
      default: true,
    },
    videoUrl: {
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

module.exports = mongoose.model('VideoTestimonial', VideoTestimonialSchema);
