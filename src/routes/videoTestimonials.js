const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const videoTestimonialController = require('../controllers/videoTestimonialController');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', auth, videoTestimonialController.listVideoTestimonials);
router.post('/', auth, upload.single('video'), videoTestimonialController.createVideoTestimonial);
router.delete('/:id', auth, videoTestimonialController.deleteVideoTestimonial);

module.exports = router;
