const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getLecturerProfile = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [lecturers] = await connection.execute(
      `SELECT l.*, u.email, u.first_name, u.last_name, u.phone 
       FROM lecturers l 
       JOIN users u ON l.user_id = u.id 
       WHERE l.user_id = ?`,
      [req.user.id]
    );

    if (lecturers.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Lecturer profile not found' });
    }

    connection.release();
    res.json({ success: true, lecturer: lecturers[0] });
  } catch (error) {
    console.error('Get lecturer profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
  }
};

const updateLecturerProfile = async (req, res) => {
  try {
    const { specialization, qualification, office_location, office_hours, bio } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      `UPDATE lecturers SET 
        specialization = ?, qualification = ?, office_location = ?, 
        office_hours = ?, bio = ?, updated_at = NOW() 
       WHERE user_id = ?`,
      [specialization, qualification, office_location, office_hours, bio, req.user.id]
    );

    await logActivity(req.user.id, 'lecturer', 'UPDATE', 'LECTURER', 'Lecturer profile updated', getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update lecturer profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [courses] = await connection.execute(
      `SELECT c.*, p.name as program_name, COUNT(DISTINCT ce.student_id) as enrolled_students
       FROM courses c
       JOIN programs p ON c.program_id = p.id
       LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.status = 'enrolled'
       WHERE c.lecturer_id = (SELECT id FROM lecturers WHERE user_id = ?)
       GROUP BY c.id
       ORDER BY c.code`,
      [req.user.id]
    );

    connection.release();
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to get courses', error: error.message });
  }
};

const getStudentsInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [students] = await connection.execute(
      `SELECT s.*, u.email, u.first_name, u.last_name, ce.enrollment_date
       FROM course_enrollments ce
       JOIN students s ON ce.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ce.course_id = ? AND ce.status = 'enrolled'
       ORDER BY u.first_name, u.last_name`,
      [courseId]
    );

    connection.release();
    res.json({ success: true, students });
  } catch (error) {
    console.error('Get students in course error:', error);
    res.status(500).json({ success: false, message: 'Failed to get students', error: error.message });
  }
};

const uploadCourseMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, file_path, material_type } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO course_materials (course_id, title, description, file_path, material_type) VALUES (?, ?, ?, ?, ?)',
      [courseId, title, description, file_path, material_type]
    );

    await logActivity(req.user.id, 'lecturer', 'UPLOAD', 'LMS', `Uploaded material for course ${courseId}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Material uploaded successfully', materialId: result.insertId });
  } catch (error) {
    console.error('Upload course material error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload material', error: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, due_date, total_marks, file_path } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO assignments (course_id, title, description, due_date, total_marks, file_path, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [courseId, title, description, due_date, total_marks, file_path, 'active']
    );

    await logActivity(req.user.id, 'lecturer', 'CREATE', 'LMS', `Created assignment for course ${courseId}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Assignment created successfully', assignmentId: result.insertId });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create assignment', error: error.message });
  }
};

const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const connection = await pool.getConnection();

    const [submissions] = await connection.execute(
      `SELECT asb.*, u.email, u.first_name, u.last_name, a.total_marks
       FROM assignment_submissions asb
       JOIN assignments a ON asb.assignment_id = a.id
       JOIN students s ON asb.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE asb.assignment_id = ?
       ORDER BY asb.submission_date DESC`,
      [assignmentId]
    );

    connection.release();
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Get assignment submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to get submissions', error: error.message });
  }
};

const gradeAssignment = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE assignment_submissions SET marks = ?, feedback = ?, status = "graded" WHERE id = ?',
      [marks, feedback, submissionId]
    );

    await logActivity(req.user.id, 'lecturer', 'GRADE', 'LMS', `Graded assignment submission ${submissionId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Assignment graded successfully' });
  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to grade assignment', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { attendance_data } = req.body; // Array of { student_id, status }
    const connection = await pool.getConnection();

    const today = new Date().toISOString().split('T')[0];

    for (const record of attendance_data) {
      await connection.execute(
        'INSERT INTO attendance (student_id, course_id, class_date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
        [record.student_id, courseId, today, record.status, record.status]
      );
    }

    await logActivity(req.user.id, 'lecturer', 'MARK', 'ATTENDANCE', `Marked attendance for course ${courseId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance', error: error.message });
  }
};

const getExamsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [exams] = await connection.execute(
      `SELECT e.*, COUNT(DISTINCT er.id) as registered_students
       FROM exams e
       LEFT JOIN exam_registrations er ON e.id = er.exam_id
       WHERE e.course_id = ?
       GROUP BY e.id
       ORDER BY e.exam_date`,
      [courseId]
    );

    connection.release();
    res.json({ success: true, exams });
  } catch (error) {
    console.error('Get exams for course error:', error);
    res.status(500).json({ success: false, message: 'Failed to get exams', error: error.message });
  }
};

const enterExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const { results_data } = req.body; // Array of { student_id, marks_obtained, grade, grade_point }
    const connection = await pool.getConnection();

    for (const result of results_data) {
      await connection.execute(
        'INSERT INTO results (exam_id, student_id, marks_obtained, grade, grade_point, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE marks_obtained = ?, grade = ?, grade_point = ?, status = ?',
        [examId, result.student_id, result.marks_obtained, result.grade, result.grade_point, 'graded', result.marks_obtained, result.grade, result.grade_point, 'graded']
      );
    }

    await logActivity(req.user.id, 'lecturer', 'ENTER', 'RESULTS', `Entered results for exam ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Results entered successfully' });
  } catch (error) {
    console.error('Enter exam results error:', error);
    res.status(500).json({ success: false, message: 'Failed to enter results', error: error.message });
  }
};

module.exports = {
  getLecturerProfile,
  updateLecturerProfile,
  getMyCourses,
  getStudentsInCourse,
  uploadCourseMaterial,
  createAssignment,
  getAssignmentSubmissions,
  gradeAssignment,
  markAttendance,
  getExamsForCourse,
  enterExamResults
};
