const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/floorAndRoomController");

const router = express.Router();

router.get("/", auth, controller.listFloorAndRooms);
router.post("/", auth, controller.createFloorAndRoom);
router.put("/:id", auth, controller.updateFloorAndRoom);
router.delete("/:id", auth, controller.deleteFloorAndRoom);

module.exports = router;
