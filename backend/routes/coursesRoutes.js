const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, coursesController.getAllCourses);
router.get('/:courseId', authenticateToken, coursesController.getCourseById);
router.post('/', authenticateToken, authorizeRole(['admin']), coursesController.createCourse);
router.put('/:courseId', authenticateToken, authorizeRole(['admin']), coursesController.updateCourse);
router.post('/:courseId/enroll', authenticateToken, authorizeRole(['admin']), coursesController.enrollStudent);

module.exports = router;
