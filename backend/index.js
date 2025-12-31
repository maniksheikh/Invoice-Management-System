const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-system';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import Person Routes
const personRoutes = require('./api/person');

// Base Route
app.get('/', (req, res) => {
  res.send('AI Invoice Management System Backend Running');
});

// Person API Routes
app.use('/api/person', personRoutes);

// AI processing endpoint placeholder
app.post('/api/process-invoice', async (req, res) => {
  res.json({ message: 'Invoice processing started' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
