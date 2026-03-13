const PaymentPolicy = require('../models/PaymentPolicy');

const getPaymentPolicy = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const data = await PaymentPolicy.findOne({ category });
    res.json({ data: data ? data.content : '' });
  } catch (err) {
    console.error('Failed to fetch payment policy:', err);
    res.status(500).json({ error: 'Failed to fetch payment policy' });
  }
};

const savePaymentPolicy = async (req, res) => {
  const { category, content } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }

  try {
    const updated = await PaymentPolicy.findOneAndUpdate(
      { category },
      { content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ data: updated });
  } catch (err) {
    console.error('Failed to save payment policy:', err);
    res.status(500).json({ error: 'Failed to save payment policy' });
  }
};

module.exports = {
  getPaymentPolicy,
  savePaymentPolicy,
};
