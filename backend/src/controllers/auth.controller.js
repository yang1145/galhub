const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// User registration
exports.register = [
  // Validation
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create new user
      const user = await User.create({ username, password });
      
      // Generate token
      const token = generateToken(user.uid);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          uid: user.uid,
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// User login
exports.login = [
  // Validation
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user.uid);

      res.json({
        message: 'Login successful',
        token,
        user: {
          uid: user.uid,
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Admin login
exports.adminLogin = [
  // Validation
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const { username, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // For admin, we can use a different token or the same one
      // Here we'll use the same approach for simplicity
      const token = jwt.sign({ admin: true, username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      res.json({
        message: 'Admin login successful',
        token,
        admin: {
          id: admin.id,
          username: admin.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];