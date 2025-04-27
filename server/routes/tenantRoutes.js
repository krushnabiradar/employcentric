const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const tenantController = require('../controllers/tenantController');

// Protect all routes - require authentication
router.use(protect());

// Routes that only superadmins can access
router.get('/', protect('superadmin'), tenantController.getTenants);
router.post('/', protect('superadmin'), tenantController.createTenant);
router.get('/pending', protect('superadmin'), tenantController.getPendingTenantRequests);
router.post('/approve', protect('superadmin'), tenantController.approveTenantRequest);
router.post('/reject', protect('superadmin'), tenantController.rejectTenantRequest);

// Get tenant by ID - superadmin can access any tenant
router.get('/:id', protect('superadmin'), tenantController.getTenantById);

// Update tenant - superadmin can update any tenant
router.put('/:id', protect('superadmin'), tenantController.updateTenant);

// Activate/suspend tenant - only superadmin
router.patch('/:id/activate', protect('superadmin'), tenantController.activateTenant);
router.patch('/:id/suspend', protect('superadmin'), tenantController.suspendTenant);

// Delete tenant - only superadmin
router.delete('/:id', protect('superadmin'), tenantController.deleteTenant);

// Tenant user management - only superadmin
router.get('/:id/users', protect('superadmin'), tenantController.getTenantUsers);
router.post('/:id/users', protect('superadmin'), tenantController.addTenantUser);

module.exports = router;
