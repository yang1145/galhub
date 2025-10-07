const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Admin login
router.post('/admin/login', authController.adminLogin);

module.exports = router;