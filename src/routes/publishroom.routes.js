const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const publishRoomController = require('../controllers/publishroom.controller');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', publishRoomController.listPublishRooms);
router.get('/:id', publishRoomController.getPublishRoom);
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
  ]),
  publishRoomController.createPublishRoom,
);
router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
  ]),
  publishRoomController.updatePublishRoom,
);
router.delete('/:id', publishRoomController.deletePublishRoom);

module.exports = router;
