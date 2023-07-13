const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const generateRandomKey = require('./config/randomKey');
require('dotenv').config(); 

const app = express();
const PORT = 5000;

// Set the JWT secret key
const secretKey = generateRandomKey();
process.env.JWT_SECRET_KEY = secretKey;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/problems', questionRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
