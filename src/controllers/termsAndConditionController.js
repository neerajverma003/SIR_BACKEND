const TermsAndCondition = require('../models/TermsAndCondition');

const getTerms = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const data = await TermsAndCondition.findOne({ category });
    res.json({ data: data ? data.content : '' });
  } catch (err) {
    console.error('Failed to fetch terms:', err);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
};

const saveTerms = async (req, res) => {
  const { category, content } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const updated = await TermsAndCondition.findOneAndUpdate(
      { category },
      { content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ data: updated });
  } catch (err) {
    console.error('Failed to save terms:', err);
    res.status(500).json({ error: 'Failed to save terms' });
  }
};

module.exports = {
  getTerms,
  saveTerms,
};
