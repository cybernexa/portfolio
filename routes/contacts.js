const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me';

function requireAdmin(req, res, next) {
  const key = req.header('x-admin-key');
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid or missing admin key' });
  }
  next();
}

// Basic email format check — good enough to catch typos, not a full RFC validator
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contacts — public: anyone can submit the contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are all required' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'That email address does not look valid' });
    }
    const contact = await Contact.create({
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 200),
      message: String(message).slice(0, 3000),
    });
    res.status(201).json({ id: contact._id, createdAt: contact.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Could not save message' });
  }
});

// GET /api/contacts — admin only: powers the DB Browser panel
router.get('/', requireAdmin, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json(contacts);
});

// DELETE /api/contacts/:id — admin only: remove a row from the DB Browser panel
router.delete('/:id', requireAdmin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
