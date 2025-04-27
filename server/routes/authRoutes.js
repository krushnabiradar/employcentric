
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { userValidation } = require('../utils/validation');
const validate = require('../middlewares/validator');
const { protect } = require('../middlewares/auth');

// Register route
router.post('/register', validate(userValidation.register), authController.register);

// Login route
router.post('/login', validate(userValidation.login), authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user route
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
