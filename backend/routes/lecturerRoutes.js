const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, authorizeRole(['lecturer']), lecturerController.getLecturerProfile);
router.put('/profile', authenticateToken, authorizeRole(['lecturer']), lecturerController.updateLecturerProfile);

router.get('/courses', authenticateToken, authorizeRole(['lecturer']), lecturerController.getMyCourses);
router.get('/courses/:courseId/students', authenticateToken, authorizeRole(['lecturer']), lecturerController.getStudentsInCourse);

// LMS - Materials and Assignments
router.post('/courses/:courseId/materials', authenticateToken, authorizeRole(['lecturer']), lecturerController.uploadCourseMaterial);
router.post('/courses/:courseId/assignments', authenticateToken, authorizeRole(['lecturer']), lecturerController.createAssignment);
router.get('/assignments/:assignmentId/submissions', authenticateToken, authorizeRole(['lecturer']), lecturerController.getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', authenticateToken, authorizeRole(['lecturer']), lecturerController.gradeAssignment);

// Attendance
router.post('/courses/:courseId/attendance', authenticateToken, authorizeRole(['lecturer']), lecturerController.markAttendance);

// Exams and Results
router.get('/courses/:courseId/exams', authenticateToken, authorizeRole(['lecturer']), lecturerController.getExamsForCourse);
router.post('/exams/:examId/results', authenticateToken, authorizeRole(['lecturer']), lecturerController.enterExamResults);

module.exports = router;
