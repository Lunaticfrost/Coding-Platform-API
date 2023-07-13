const mongoose = require('mongoose');
require('dotenv').config(); 
const generateRandomKey = require('./randomKey');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
    process.exit(1);
  }
}

module.exports = connectDB;
