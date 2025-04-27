
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getAllPayrolls,
  getPayroll,
  createPayroll,
  updatePayroll,
  getPayrollsByPeriod,
  getPayrollStats
} = require('../controllers/payrollController');

// All routes are protected and only accessible by admin, HR, or finance roles
router
  .route('/')
  .get(protect, authorize('admin', 'hr'), getAllPayrolls)
  .post(protect, authorize('admin', 'hr'), createPayroll);

router.get('/stats', protect, authorize('admin', 'hr'), getPayrollStats);
router.get('/period/:period', protect, authorize('admin', 'hr'), getPayrollsByPeriod);

router
  .route('/:id')
  .get(protect, getPayroll)
  .put(protect, authorize('admin', 'hr'), updatePayroll);

module.exports = router;
