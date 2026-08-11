const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRole(['admin', 'lecturer']), resultsController.getAllResults);
router.post('/', authenticateToken, authorizeRole(['lecturer']), resultsController.submitResult);
router.put('/:examId/publish', authenticateToken, authorizeRole(['admin']), resultsController.publishResults);

router.get('/course', authenticateToken, resultsController.getCourseResults);
router.post('/course/compile', authenticateToken, authorizeRole(['lecturer']), resultsController.compileCourseResults);

router.get('/transcript/:studentId', authenticateToken, authorizeRole(['admin', 'student']), resultsController.generateTranscript);

module.exports = router;
