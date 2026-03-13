const express = require('express');
const { createContact, listContacts } = require('../controllers/contactController');

const router = express.Router();

// Public: create a new contact/enquiry
router.post('/', createContact);

// Admin: list submitted enquiries (optional)
router.get('/', listContacts);

module.exports = router;
