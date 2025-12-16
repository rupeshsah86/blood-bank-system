const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Import routes
const donorRoutes = require('./routes/donorRoutes');
const authRoutes = require('./routes/authRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bloodbank', bloodBankRoutes);
app.use('/api/requests', bloodRequestRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Blood Bank Management System API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});