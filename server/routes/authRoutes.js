const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect(), authController.getCurrentUser);
router.put('/profile', protect(), authController.updateProfile);

// Admin routes
router.get('/users', protect(['admin', 'superadmin']), authController.getAllUsers);
router.put('/users/:id/status', protect(['admin', 'superadmin']), authController.updateUserStatus);

module.exports = router;