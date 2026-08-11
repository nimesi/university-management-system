const express = require('express');
const router = express.Router();
const lmsController = require('../controllers/lmsController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Course Materials
router.get('/materials', authenticateToken, lmsController.getAllCourseMaterials);
router.post('/materials', authenticateToken, authorizeRole(['lecturer']), lmsController.uploadMaterial);
router.delete('/materials/:materialId', authenticateToken, authorizeRole(['lecturer']), lmsController.deleteMaterial);

// Assignments
router.get('/assignments', authenticateToken, lmsController.getAllAssignments);
router.get('/assignments/:assignmentId', authenticateToken, lmsController.getAssignmentDetails);
router.put('/assignments/:assignmentId/close', authenticateToken, authorizeRole(['lecturer']), lmsController.closeAssignment);

// Attendance
router.get('/attendance', authenticateToken, lmsController.getAttendanceReport);

module.exports = router;
