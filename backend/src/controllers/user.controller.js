const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// Get user profile
exports.getProfile = [
  authenticate,

  async (req, res) => {
    try {
      res.json({
        user: {
          uid: req.user.uid,
          username: req.user.username,
          created_at: req.user.created_at
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Update user profile
exports.updateProfile = [
  authenticate,
  
  // Validation
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

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

      const { username } = req.body;

      // Check if new username is already taken (if it's being changed)
      if (username && username !== req.user.username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
        req.user.username = username;
      }

      await req.user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          uid: req.user.uid,
          username: req.user.username
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Delete user account
exports.deleteAccount = [
  authenticate,

  async (req, res) => {
    try {
      await req.user.destroy();
      
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];