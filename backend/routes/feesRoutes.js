const express = require('express');
const router = express.Router();
const feesController = require('../controllers/feesController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRole(['admin']), feesController.getAllFees);
router.post('/', authenticateToken, authorizeRole(['admin']), feesController.createFeeStructure);
router.post('/payment', authenticateToken, authorizeRole(['admin', 'student']), feesController.recordFeePayment);
router.get('/:feeId/payments', authenticateToken, feesController.getFeePaymentHistory);
router.get('/student/:studentId', authenticateToken, authorizeRole(['admin', 'student']), feesController.getStudentFeeStatus);
router.get('/report/generate', authenticateToken, authorizeRole(['admin']), feesController.generateFeeReport);

module.exports = router;
