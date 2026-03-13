const Contact = require('../models/Contact');

const createContact = async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const item = await Contact.create({
      name,
      phone,
      email,
      message,
    });

    res.status(201).json({ data: item });
  } catch (err) {
    console.error('Failed to create contact message:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

const listContacts = async (req, res) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    console.error('Failed to fetch contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

module.exports = {
  createContact,
  listContacts,
};
