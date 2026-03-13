const FloorAndRoom = require("../models/FloorAndRoom");

const listFloorAndRooms = async (req, res) => {
  try {
    // Return results in creation order so older entries show first.
    const items = await FloorAndRoom.find().sort({ createdAt: 1 });
    res.json({ data: items });
  } catch (err) {
    console.error("Failed to fetch floor & rooms:", err);
    res.status(500).json({ error: "Failed to fetch floor & rooms" });
  }
};

const createFloorAndRoom = async (req, res) => {
  try {
    // Debug: log incoming request body and current schema types
    console.log("createFloorAndRoom request body:", req.body);
    console.log("FloorAndRoom schema types:", {
      floorNumber: FloorAndRoom.schema.path('floorNumber')?.instance,
      roomNumber: FloorAndRoom.schema.path('roomNumber')?.instance,
      hallName: FloorAndRoom.schema.path('hallName')?.instance,
      roomType: FloorAndRoom.schema.path('roomType')?.instance,
    });

    const payload = {
      floorNumber: String(req.body.floorNumber || ""),
      roomType: String(req.body.roomType || ""),
    };

    if (req.body.roomNumber) payload.roomNumber = String(req.body.roomNumber);
    if (req.body.hallName) payload.hallName = String(req.body.hallName);
    const item = await FloorAndRoom.create(payload);
    res.status(201).json({ data: item });
  } catch (err) {
    console.error("Failed to create floor & room:", err);
    res.status(500).json({ error: "Failed to create floor & room" });
  }
};

const updateFloorAndRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await FloorAndRoom.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Floor & room not found" });
    }

    const payload = {
      floorNumber: String(req.body.floorNumber || item.floorNumber || ""),
      roomType: String(req.body.roomType || item.roomType || ""),
    };

    if (req.body.roomNumber || item.roomNumber) {
      payload.roomNumber = String(req.body.roomNumber || item.roomNumber);
    }
    if (req.body.hallName || item.hallName) {
      payload.hallName = String(req.body.hallName || item.hallName);
    }

    Object.assign(item, payload);
    await item.save();

    res.json({ data: item });
  } catch (err) {
    console.error("Failed to update floor & room:", err);
    res.status(500).json({ error: "Failed to update floor & room" });
  }
};

const deleteFloorAndRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await FloorAndRoom.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Floor & room not found" });
    }

    await item.deleteOne();
    res.json({ data: item });
  } catch (err) {
    console.error("Failed to delete floor & room:", err);
    res.status(500).json({ error: "Failed to delete floor & room" });
  }
};

module.exports = {
  listFloorAndRooms,
  createFloorAndRoom,
  updateFloorAndRoom,
  deleteFloorAndRoom,
};
