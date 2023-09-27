const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Test connection
router.get('/test', (req, res) => {
  res.send('Hello from auth');
});

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  // Validate username length before saving to the database
  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Invalid username length' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error while saving the user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.send('Logout');
});

module.exports = router;
