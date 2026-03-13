const express = require('express');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// Public reservation endpoints
router.get('/', reservationController.listReservations);
router.post('/', reservationController.createReservation);

module.exports = router;
