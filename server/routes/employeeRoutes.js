const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');

// All routes are protected and only accessible by admin or HR
router
  .route('/')
  .get(protect(['admin', 'hr', 'manager']), getAllEmployees)
  .post(protect(['admin', 'hr']), createEmployee);

router
  .route('/:id')
  .get(protect(['admin', 'hr']), getEmployee)
  .put(protect(['admin', 'hr']), updateEmployee)
  .delete(protect(['admin']), deleteEmployee);

// Get employee statistics
router.get('/stats', protect(['admin', 'hr']), getEmployeeStats);

module.exports = router;
