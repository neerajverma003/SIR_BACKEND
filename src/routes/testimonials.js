const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const testimonialController = require('../controllers/testimonialController');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public testimonials (only verified ones should be shown by clients)
router.get('/', testimonialController.listTestimonials);

// Admin-managed testimonials
router.post('/', auth, upload.single('profileImage'), testimonialController.createTestimonial);
router.patch('/:id/verify', auth, testimonialController.toggleVerifyTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

module.exports = router;
