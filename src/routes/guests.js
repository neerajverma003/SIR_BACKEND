const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/guestController');

const router = express.Router();

router.get('/', auth, controller.listGuests);
router.post('/', auth, controller.createGuest);

module.exports = router;
