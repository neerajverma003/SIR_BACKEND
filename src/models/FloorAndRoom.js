const mongoose = require('mongoose');

const FloorAndRoomSchema = new mongoose.Schema(
  {
    floorNumber: { type: String, required: true },
    roomNumber: { type: String, default: undefined },
    hallName: { type: String, default: undefined },
    roomType: { type: String, default: "Standard" },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    price: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const MODEL_NAME = "FloorAndRoom";

// Ensure schema updates during development (avoid old cached model definitions)
if (mongoose.models[MODEL_NAME]) {
  delete mongoose.models[MODEL_NAME];
  delete mongoose.modelSchemas[MODEL_NAME];
}

module.exports = mongoose.model(MODEL_NAME, FloorAndRoomSchema);
