const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRole(['admin']), activityLogController.getActivityLogs);
router.get('/user/:userId', authenticateToken, authorizeRole(['admin']), activityLogController.getUserActivity);
router.get('/stats', authenticateToken, authorizeRole(['admin']), activityLogController.getActivityStats);
router.get('/export', authenticateToken, authorizeRole(['admin']), activityLogController.exportActivityLogs);

module.exports = router;
