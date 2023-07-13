const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config(); 

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

     // Generate a salt for password hashing
     const saltRounds = 10;
     const salt = await bcrypt.genSalt(saltRounds);
 
     // Hash the password using the generated salt
     const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    // Return the response
    res.json({ email, accessToken: token });
  } catch (error) {
    console.error('Signup error', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      // Find the user in the database
      const user = await User.findOne({ email });
  
      // If the user is not found, return an error
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // If the passwords don't match, return an error
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Check if the user has the required role (admin or participant)
      if (role && role !== user.role) {
        return res.status(401).json({ error: 'Invalid role for login' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  
      // Return the response with email and access token
      res.json({ email, accessToken: token });
    } catch (error) {
      console.error('Login error', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  router.get('/protected-route', authMiddleware, (req, res) => {
    if (req.user.role === 'admin') {
      // Only authenticated admins with a valid access token will reach this block
      res.json({ message: 'Access granted for admins' });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  });

module.exports = router;
