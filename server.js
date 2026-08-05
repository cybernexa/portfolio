require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

app.use(express.json());

// Serve the portfolio frontend
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/contacts', contactsRouter);

// Fallback to index.html for the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
