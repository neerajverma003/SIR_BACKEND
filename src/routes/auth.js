const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected example
router.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
