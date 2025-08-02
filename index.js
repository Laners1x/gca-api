require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json()); // modern alternative to body-parser

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use(routes); // no '/api' prefix, routes like /getUser

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 API running on port ${port}`));
