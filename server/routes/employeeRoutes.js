
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// All routes are protected and only accessible by admin or HR
router
  .route('/')
  .get(protect, getAllEmployees)
  .post(protect, authorize('admin', 'hr'), createEmployee);

router
  .route('/:id')
  .get(protect, getEmployee)
  .put(protect, authorize('admin', 'hr'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
