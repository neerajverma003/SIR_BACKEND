const express = require('express');
const auth = require('../middleware/auth');
const cancellationController = require('../controllers/cancellationPolicyController');

const router = express.Router();

// Cancellation Policy (admin-managed)
router.get('/', auth, cancellationController.getCancellationPolicy);
router.post('/', auth, cancellationController.saveCancellationPolicy);

module.exports = router;
