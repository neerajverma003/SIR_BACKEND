const mongoose = require('mongoose');

const PublishRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    overview: { type: String, default: '' },
    price: { type: String, default: '' },
    rating: { type: Number, default: 4 },
    guests: { type: Number, default: 2 },
    amenities: { type: [String], default: [] },
    mainImage: {
      url: { type: String, default: '' },
      cloudinaryId: { type: String, default: '' },
    },
    gallery: [
      {
        url: { type: String, default: '' },
        cloudinaryId: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MODEL_NAME = 'PublishRoom';

if (mongoose.models[MODEL_NAME]) {
  delete mongoose.models[MODEL_NAME];
  delete mongoose.modelSchemas[MODEL_NAME];
}

module.exports = mongoose.model(MODEL_NAME, PublishRoomSchema);
