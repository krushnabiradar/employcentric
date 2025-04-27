const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getTodayAttendance,
  getMonthlyAttendance,
  checkIn,
  checkOut,
  getAttendanceStats
} = require('../controllers/attendanceController');

// Public routes - none

// Protected routes
router.get('/today', protect(), getTodayAttendance);
router.get('/stats', protect(['admin', 'hr']), getAttendanceStats);
router.get('/:employeeId', protect(), getMonthlyAttendance); // Fixed: Added ()
router.post('/check-in', protect(), checkIn); // Fixed: Added ()
router.post('/check-out', protect(), checkOut); // Fixed: Added ()

module.exports = router;