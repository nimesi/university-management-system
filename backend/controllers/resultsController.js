const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getAllResults = async (req, res) => {
  try {
    const { studentId, examId, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT r.*, e.exam_type, c.code, c.title, u.email, u.first_name, u.last_name
                 FROM results r
                 JOIN exams e ON r.exam_id = e.id
                 JOIN courses c ON e.course_id = c.id
                 JOIN students s ON r.student_id = s.id
                 JOIN users u ON s.user_id = u.id
                 WHERE 1=1`;
    const params = [];

    if (studentId) {
      query += ' AND r.student_id = ?';
      params.push(studentId);
    }
    if (examId) {
      query += ' AND r.exam_id = ?';
      params.push(examId);
    }
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [results] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, results, page, limit });
  } catch (error) {
    console.error('Get all results error:', error);
    res.status(500).json({ success: false, message: 'Failed to get results', error: error.message });
  }
};

const submitResult = async (req, res) => {
  try {
    const { exam_id, student_id, marks_obtained, grade, grade_point } = req.body;
    const connection = await pool.getConnection();

    const [exam] = await connection.execute('SELECT max_marks FROM exams WHERE id = ?', [exam_id]);
    const maxMarks = exam[0].max_marks;

    const [existing] = await connection.execute(
      'SELECT id FROM results WHERE exam_id = ? AND student_id = ?',
      [exam_id, student_id]
    );

    if (existing.length > 0) {
      await connection.execute(
        'UPDATE results SET marks_obtained = ?, grade = ?, grade_point = ?, status = "graded" WHERE exam_id = ? AND student_id = ?',
        [marks_obtained, grade, grade_point, exam_id, student_id]
      );
    } else {
      await connection.execute(
        'INSERT INTO results (exam_id, student_id, marks_obtained, total_marks, grade, grade_point, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [exam_id, student_id, marks_obtained, maxMarks, grade, grade_point, 'graded']
      );
    }

    await logActivity(req.user.id, req.user.role, 'SUBMIT', 'RESULTS', `Submitted result for exam ${exam_id}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Result submitted successfully' });
  } catch (error) {
    console.error('Submit result error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit result', error: error.message });
  }
};

const publishResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE results SET status = "published", published_date = NOW() WHERE exam_id = ? AND status = "graded"',
      [examId]
    );

    await logActivity(req.user.id, req.user.role, 'PUBLISH', 'RESULTS', `Published results for exam ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Results published successfully' });
  } catch (error) {
    console.error('Publish results error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish results', error: error.message });
  }
};

const getCourseResults = async (req, res) => {
  try {
    const { studentId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT cr.*, c.code, c.title
                 FROM course_results cr
                 JOIN courses c ON cr.course_id = c.id
                 WHERE cr.status = 'published'`;
    const params = [];

    if (studentId) {
      query += ' AND cr.student_id = ?';
      params.push(studentId);
    }

    query += ' ORDER BY cr.academic_year DESC, cr.semester DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [results] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, results, page, limit });
  } catch (error) {
    console.error('Get course results error:', error);
    res.status(500).json({ success: false, message: 'Failed to get course results', error: error.message });
  }
};

const compileCourseResults = async (req, res) => {
  try {
    const { student_id, course_id, semester, academic_year, midterm_marks, final_marks, assignment_marks } = req.body;
    const connection = await pool.getConnection();

    const totalMarks = (midterm_marks || 0) + (final_marks || 0) + (assignment_marks || 0);

    const [existing] = await connection.execute(
      'SELECT id FROM course_results WHERE student_id = ? AND course_id = ? AND semester = ? AND academic_year = ?',
      [student_id, course_id, semester, academic_year]
    );

    if (existing.length > 0) {
      await connection.execute(
        'UPDATE course_results SET midterm_marks = ?, final_marks = ?, assignment_marks = ?, total_marks = ?, status = "graded" WHERE student_id = ? AND course_id = ? AND semester = ? AND academic_year = ?',
        [midterm_marks, final_marks, assignment_marks, totalMarks, student_id, course_id, semester, academic_year]
      );
    } else {
      await connection.execute(
        'INSERT INTO course_results (student_id, course_id, semester, academic_year, midterm_marks, final_marks, assignment_marks, total_marks, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [student_id, course_id, semester, academic_year, midterm_marks, final_marks, assignment_marks, totalMarks, 'graded']
      );
    }

    await logActivity(req.user.id, req.user.role, 'COMPILE', 'RESULTS', `Compiled course result for student ${student_id}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Course results compiled successfully' });
  } catch (error) {
    console.error('Compile course results error:', error);
    res.status(500).json({ success: false, message: 'Failed to compile course results', error: error.message });
  }
};

const generateTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    const connection = await pool.getConnection();

    const [transcript] = await connection.execute(
      `SELECT cr.*, c.code, c.title, c.credit_hours, u.email, u.first_name, u.last_name, s.registration_number
       FROM course_results cr
       JOIN courses c ON cr.course_id = c.id
       JOIN students s ON cr.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE cr.student_id = ? AND cr.status = 'published'
       ORDER BY cr.academic_year DESC, cr.semester DESC`,
      [studentId]
    );

    if (transcript.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'No transcript found' });
    }

    // Calculate CGPA
    const totalGradePoints = transcript.reduce((sum, result) => sum + (result.grade_point * result.credit_hours), 0);
    const totalCreditHours = transcript.reduce((sum, result) => sum + result.credit_hours, 0);
    const cgpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : 0;

    connection.release();
    res.json({ success: true, transcript, cgpa, student: transcript[0] });
  } catch (error) {
    console.error('Generate transcript error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate transcript', error: error.message });
  }
};

module.exports = {
  getAllResults,
  submitResult,
  publishResults,
  getCourseResults,
  compileCourseResults,
  generateTranscript
};
