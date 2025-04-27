const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { protect } = require('../middlewares/auth');

// Protect all system routes - only accessible by superadmin
router.use(protect('superadmin'));

// System statistics and monitoring
router.get('/stats', systemController.getSystemStats);
router.get('/alerts', systemController.getSystemAlerts);
router.get('/tenant-growth', systemController.getTenantGrowth);
router.get('/usage', systemController.getSystemUsage);

module.exports = router;
