const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getStudentProfile = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.execute(
      `SELECT s.*, u.email, u.first_name, u.last_name, u.phone, p.name as program_name 
       FROM students s 
       JOIN users u ON s.user_id = u.id 
       LEFT JOIN programs p ON s.program_id = p.id 
       WHERE s.user_id = ?`,
      [req.user.id]
    );

    if (students.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    connection.release();
    res.json({ success: true, student: students[0] });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get profile', error: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { date_of_birth, gender, address, city, state, country, postal_code, guardian_name, guardian_phone } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      `UPDATE students SET 
        date_of_birth = ?, gender = ?, address = ?, city = ?, 
        state = ?, country = ?, postal_code = ?, 
        guardian_name = ?, guardian_phone = ?, updated_at = NOW() 
       WHERE user_id = ?`,
      [date_of_birth, gender, address, city, state, country, postal_code, guardian_name, guardian_phone, req.user.id]
    );

    await logActivity(req.user.id, 'student', 'UPDATE', 'STUDENT', 'Student profile updated', getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [courses] = await connection.execute(
      `SELECT c.*, l.user_id as lecturer_id, u.first_name, u.last_name, 
              ce.enrollment_date, ce.status
       FROM course_enrollments ce
       JOIN courses c ON ce.course_id = c.id
       LEFT JOIN lecturers l ON c.lecturer_id = l.id
       LEFT JOIN users u ON l.user_id = u.id
       JOIN students s ON ce.student_id = s.id
       WHERE s.user_id = ? AND ce.status = 'enrolled'
       ORDER BY c.code`,
      [req.user.id]
    );

    connection.release();
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to get courses', error: error.message });
  }
};

const getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [materials] = await connection.execute(
      `SELECT * FROM course_materials WHERE course_id = ? ORDER BY upload_date DESC`,
      [courseId]
    );

    connection.release();
    res.json({ success: true, materials });
  } catch (error) {
    console.error('Get course materials error:', error);
    res.status(500).json({ success: false, message: 'Failed to get materials', error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [assignments] = await connection.execute(
      `SELECT a.*, 
              CASE WHEN asb.id IS NOT NULL THEN 'submitted' ELSE 'pending' END as submission_status,
              asb.marks, asb.feedback
       FROM assignments a
       LEFT JOIN assignment_submissions asb ON a.id = asb.assignment_id
       WHERE a.course_id = ?
       ORDER BY a.due_date`,
      [courseId]
    );

    connection.release();
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get assignments', error: error.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { file_path } = req.body;
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [existing] = await connection.execute(
      'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?',
      [assignmentId, studentId]
    );

    if (existing.length > 0) {
      await connection.execute(
        'UPDATE assignment_submissions SET file_path = ?, submission_date = NOW(), status = ? WHERE assignment_id = ? AND student_id = ?',
        [file_path, 'submitted', assignmentId, studentId]
      );
    } else {
      await connection.execute(
        'INSERT INTO assignment_submissions (assignment_id, student_id, file_path, status) VALUES (?, ?, ?, ?)',
        [assignmentId, studentId, file_path, 'submitted']
      );
    }

    await logActivity(req.user.id, 'student', 'SUBMIT', 'LMS', `Assignment ${assignmentId} submitted`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit assignment', error: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [attendance] = await connection.execute(
      `SELECT a.*, c.code, c.title
       FROM attendance a
       JOIN courses c ON a.course_id = c.id
       WHERE a.student_id = ? AND a.course_id = ?
       ORDER BY a.class_date DESC`,
      [studentId, courseId]
    );

    connection.release();
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to get attendance', error: error.message });
  }
};

const getExams = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [exams] = await connection.execute(
      `SELECT e.*, c.code, c.title, er.status as registration_status, er.seat_number, er.room_number
       FROM exams e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN exam_registrations er ON e.id = er.exam_id AND er.student_id = ?
       WHERE e.exam_date >= NOW()
       ORDER BY e.exam_date`,
      [studentId]
    );

    connection.release();
    res.json({ success: true, exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ success: false, message: 'Failed to get exams', error: error.message });
  }
};

const registerForExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [existing] = await connection.execute(
      'SELECT id FROM exam_registrations WHERE exam_id = ? AND student_id = ?',
      [examId, studentId]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Already registered for this exam' });
    }

    await connection.execute(
      'INSERT INTO exam_registrations (exam_id, student_id, status) VALUES (?, ?, ?)',
      [examId, studentId, 'registered']
    );

    await logActivity(req.user.id, 'student', 'REGISTER', 'EXAMS', `Registered for exam ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Successfully registered for exam' });
  } catch (error) {
    console.error('Register for exam error:', error);
    res.status(500).json({ success: false, message: 'Failed to register for exam', error: error.message });
  }
};

const getCourseResults = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [results] = await connection.execute(
      `SELECT cr.*, c.code, c.title
       FROM course_results cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = ? AND cr.status = 'published'
       ORDER BY cr.academic_year DESC, cr.semester DESC`,
      [studentId]
    );

    connection.release();
    res.json({ success: true, results });
  } catch (error) {
    console.error('Get course results error:', error);
    res.status(500).json({ success: false, message: 'Failed to get results', error: error.message });
  }
};

const getFeeStatus = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [fees] = await connection.execute(
      `SELECT f.*, COALESCE(SUM(fp.amount), 0) as paid_amount
       FROM fees f
       LEFT JOIN fee_payments fp ON f.id = fp.fee_id
       WHERE f.student_id = ?
       GROUP BY f.id
       ORDER BY f.semester DESC`,
      [studentId]
    );

    connection.release();
    res.json({ success: true, fees });
  } catch (error) {
    console.error('Get fee status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get fee status', error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [students] = await connection.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
    const studentId = students[0].id;

    const [payments] = await connection.execute(
      `SELECT fp.*, f.fee_amount, f.semester
       FROM fee_payments fp
       JOIN fees f ON fp.fee_id = f.id
       WHERE f.student_id = ?
       ORDER BY fp.payment_date DESC`,
      [studentId]
    );

    connection.release();
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment history', error: error.message });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getEnrolledCourses,
  getCourseMaterials,
  getAssignments,
  submitAssignment,
  getAttendance,
  getExams,
  registerForExam,
  getCourseResults,
  getFeeStatus,
  getPaymentHistory
};
