const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
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
  .get(protect(['admin', 'hr']), getAllPayrolls)
  .post(protect(['admin', 'hr']), createPayroll);

router.get('/stats', protect(['admin', 'hr']), getPayrollStats);
router.get('/period/:period', protect(['admin', 'hr']), getPayrollsByPeriod);

router
  .route('/:id')
  .get(protect(), getPayroll)
  .put(protect(['admin', 'hr']), updatePayroll);

module.exports = router;
