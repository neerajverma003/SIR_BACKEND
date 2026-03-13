const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const galleryController = require('../controllers/galleryController');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public endpoint: anyone can view gallery images
router.get('/', galleryController.listGalleryImages);

// Restricted endpoints (requires auth)
router.post('/', auth, upload.array('images', 50), galleryController.uploadGalleryImages);
router.delete('/', auth, galleryController.deleteGalleryImages);

module.exports = router;
