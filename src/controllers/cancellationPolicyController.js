const CancellationPolicy = require('../models/CancellationPolicy');

const getCancellationPolicy = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const data = await CancellationPolicy.findOne({ category });
    res.json({ data: data ? data.content : '' });
  } catch (err) {
    console.error('Failed to fetch cancellation policy:', err);
    res.status(500).json({ error: 'Failed to fetch cancellation policy' });
  }
};

const saveCancellationPolicy = async (req, res) => {
  const { category, content } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const updated = await CancellationPolicy.findOneAndUpdate(
      { category },
      { content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ data: updated });
  } catch (err) {
    console.error('Failed to save cancellation policy:', err);
    res.status(500).json({ error: 'Failed to save cancellation policy' });
  }
};

module.exports = {
  getCancellationPolicy,
  saveCancellationPolicy,
};
