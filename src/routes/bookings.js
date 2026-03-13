const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const controller = require('../controllers/bookingController');

const upload = multer({ storage: multer.memoryStorage() });

const bookingDocuments = upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'drivingLicense', maxCount: 1 },
  { name: 'electionCard', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
]);

const router = express.Router();

router.get('/', auth, controller.listBookings);
router.post('/', auth, bookingDocuments, controller.createBooking);
router.put('/:id', auth, bookingDocuments, controller.updateBooking);
router.delete('/:id', auth, controller.deleteBooking);

module.exports = router;
