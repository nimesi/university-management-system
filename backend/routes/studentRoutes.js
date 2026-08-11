const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, authorizeRole(['student']), studentController.getStudentProfile);
router.put('/profile', authenticateToken, authorizeRole(['student']), studentController.updateStudentProfile);

router.get('/courses', authenticateToken, authorizeRole(['student']), studentController.getEnrolledCourses);
router.get('/courses/:courseId/materials', authenticateToken, authorizeRole(['student']), studentController.getCourseMaterials);
router.get('/courses/:courseId/assignments', authenticateToken, authorizeRole(['student']), studentController.getAssignments);
router.post('/assignments/:assignmentId/submit', authenticateToken, authorizeRole(['student']), studentController.submitAssignment);

router.get('/courses/:courseId/attendance', authenticateToken, authorizeRole(['student']), studentController.getAttendance);
router.get('/exams', authenticateToken, authorizeRole(['student']), studentController.getExams);
router.post('/exams/:examId/register', authenticateToken, authorizeRole(['student']), studentController.registerForExam);

router.get('/results', authenticateToken, authorizeRole(['student']), studentController.getCourseResults);
router.get('/fees', authenticateToken, authorizeRole(['student']), studentController.getFeeStatus);
router.get('/payments', authenticateToken, authorizeRole(['student']), studentController.getPaymentHistory);

module.exports = router;
