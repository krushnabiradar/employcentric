
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const tenantController = require('../controllers/tenantController');

// Protect all routes - require authentication
router.use(protect);

// Routes that only superadmins can access
router.get('/', authorize('superadmin'), tenantController.getTenants);
router.post('/', authorize('superadmin'), tenantController.createTenant);
router.get('/pending', authorize('superadmin'), tenantController.getPendingTenantRequests);
router.post('/approve', authorize('superadmin'), tenantController.approveTenantRequest);
router.post('/reject', authorize('superadmin'), tenantController.rejectTenantRequest);

// Get tenant by ID - superadmin can access any tenant
router.get('/:id', authorize('superadmin'), tenantController.getTenantById);

// Update tenant - superadmin can update any tenant
router.put('/:id', authorize('superadmin'), tenantController.updateTenant);

// Activate/suspend tenant - only superadmin
router.patch('/:id/activate', authorize('superadmin'), tenantController.activateTenant);
router.patch('/:id/suspend', authorize('superadmin'), tenantController.suspendTenant);

// Delete tenant - only superadmin
router.delete('/:id', authorize('superadmin'), tenantController.deleteTenant);

// Tenant user management - only superadmin
router.get('/:id/users', authorize('superadmin'), tenantController.getTenantUsers);
router.post('/:id/users', authorize('superadmin'), tenantController.addTenantUser);

module.exports = router;
