const express = require('express');
const auth = require('../middleware/auth');
const paymentPolicyController = require('../controllers/paymentPolicyController');

const router = express.Router();

// Payment Policy (admin-managed)
router.get('/', auth, paymentPolicyController.getPaymentPolicy);
router.post('/', auth, paymentPolicyController.savePaymentPolicy);

module.exports = router;
