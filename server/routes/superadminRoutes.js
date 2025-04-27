const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');
const { protect } = require('../middlewares/auth');

// Apply combined auth and role check middleware
router.use(protect('superadmin'));

// Tenant routes
router.get('/tenants', superadminController.getAllTenants);
router.get('/tenants/:id', superadminController.getTenantById);
router.post('/tenants', superadminController.createTenant);
router.put('/tenants/:id', superadminController.updateTenant);
router.delete('/tenants/:id', superadminController.deleteTenant);
router.get('/tenants/stats', superadminController.getTenantStats);

// User management routes
router.get('/users', superadminController.getAllUsers);
router.get('/users/:id', superadminController.getUserById);
router.put('/users/:id', superadminController.updateUser);
router.delete('/users/:id', superadminController.deleteUser);

module.exports = router; 