const express = require('express');
const auth = require('../middleware/auth');
const termsController = require('../controllers/termsAndConditionController');

const router = express.Router();

// Terms & Conditions (admin-managed)
router.get('/', auth, termsController.getTerms);
router.post('/', auth, termsController.saveTerms);

module.exports = router;
