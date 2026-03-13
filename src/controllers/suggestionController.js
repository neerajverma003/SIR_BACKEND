const Suggestion = require('../models/Suggestion');

const createSuggestion = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const item = await Suggestion.create({ name, phone, email, message });
    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create suggestion:', err);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
};

const listSuggestions = async (req, res) => {
  try {
    const items = await Suggestion.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch suggestions:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};

module.exports = {
  createSuggestion,
  listSuggestions,
};
