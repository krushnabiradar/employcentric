const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { leaveValidation } = require('../utils/validation');
const { protect, validate } = require('../middlewares/auth');

// Get all leaves
router.get('/', protect(), leaveController.getAllLeaves);

// Create new leave request
router.post('/', protect(), validate(leaveValidation), leaveController.createLeave);

// Approve leave request
router.put('/:id/approve', protect(['admin', 'hr']), leaveController.approveLeave);

// Reject leave request
router.put('/:id/reject', protect(['admin', 'hr']), leaveController.rejectLeave);

module.exports = router;
