const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, examController.getAllExams);
router.post('/', authenticateToken, authorizeRole(['admin']), examController.createExam);
router.put('/:examId', authenticateToken, authorizeRole(['admin']), examController.updateExam);

router.get('/:examId/registrations', authenticateToken, authorizeRole(['admin', 'lecturer']), examController.getExamRegistrations);
router.post('/:examId/allocate-seats', authenticateToken, authorizeRole(['admin']), examController.allocateSeats);
router.post('/:examId/mark-attendance', authenticateToken, authorizeRole(['admin', 'lecturer']), examController.markAttendance);
router.get('/:examId/hall-tickets', authenticateToken, authorizeRole(['admin', 'lecturer']), examController.generateExamHall);

module.exports = router;
