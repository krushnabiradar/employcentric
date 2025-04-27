
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getTodayAttendance,
  getMonthlyAttendance,
  checkIn,
  checkOut,
  getAttendanceStats
} = require('../controllers/attendanceController');

// Public routes - none

// Protected routes
router.get('/today', protect, getTodayAttendance);
router.get('/stats', protect, authorize(['admin', 'hr']), getAttendanceStats);
router.get('/:employeeId', protect, getMonthlyAttendance);
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);

module.exports = router;
