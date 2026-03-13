const Room = require('../models/Room');

exports.list = async (req, res, next) => {
  try {
    const rooms = await Room.find().limit(200).lean();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const r = new Room(req.body);
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    next(err);
  }
};
