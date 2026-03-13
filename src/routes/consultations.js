const express = require('express');
const { createConsultationRequest, listConsultationRequests } = require('../controllers/consultationController');

const router = express.Router();

// Public: submit a consultation request
router.post('/', createConsultationRequest);

// Admin: list all consultation requests
router.get('/', listConsultationRequests);

module.exports = router;
