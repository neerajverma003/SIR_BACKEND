const express = require('express');
const { createSuggestion, listSuggestions } = require('../controllers/suggestionController');

const router = express.Router();

// Public: submit a suggestion
router.post('/', createSuggestion);

// Admin: list all suggestions
router.get('/', listSuggestions);

module.exports = router;
