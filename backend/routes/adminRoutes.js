const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// User Management
router.get('/users', authenticateToken, authorizeRole(['admin']), adminController.getAllUsers);
router.post('/users', authenticateToken, authorizeRole(['admin']), adminController.createUser);
router.put('/users/:userId', authenticateToken, authorizeRole(['admin']), adminController.updateUser);
router.delete('/users/:userId', authenticateToken, authorizeRole(['admin']), adminController.deleteUser);

// Student Management
router.get('/students', authenticateToken, authorizeRole(['admin']), adminController.getAllStudents);
router.put('/students/:studentId/status', authenticateToken, authorizeRole(['admin']), adminController.updateStudentStatus);

// Program Management
router.get('/programs', authenticateToken, adminController.getAllPrograms);
router.post('/programs', authenticateToken, authorizeRole(['admin']), adminController.createProgram);

// Admission Applications
router.get('/applications', authenticateToken, authorizeRole(['admin']), adminController.getAdmissionApplications);
router.put('/applications/:applicationId/review', authenticateToken, authorizeRole(['admin']), adminController.reviewAdmissionApplication);

module.exports = router;
