const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getAllExams = async (req, res) => {
  try {
    const { courseId, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT e.*, c.code, c.title
                 FROM exams e
                 JOIN courses c ON e.course_id = c.id
                 WHERE 1=1`;
    const params = [];

    if (courseId) {
      query += ' AND e.course_id = ?';
      params.push(courseId);
    }
    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    query += ' ORDER BY e.exam_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [exams] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, exams, page, limit });
  } catch (error) {
    console.error('Get all exams error:', error);
    res.status(500).json({ success: false, message: 'Failed to get exams', error: error.message });
  }
};

const createExam = async (req, res) => {
  try {
    const { course_id, exam_type, exam_date, duration_minutes, location, max_marks } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO exams (course_id, exam_type, exam_date, duration_minutes, location, max_marks, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [course_id, exam_type, exam_date, duration_minutes, location, max_marks, 'scheduled']
    );

    await logActivity(req.user.id, req.user.role, 'CREATE', 'EXAMS', `Created exam for course ${course_id}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Exam created successfully', examId: result.insertId });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ success: false, message: 'Failed to create exam', error: error.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { exam_date, duration_minutes, location, status } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE exams SET exam_date = ?, duration_minutes = ?, location = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [exam_date, duration_minutes, location, status, examId]
    );

    await logActivity(req.user.id, req.user.role, 'UPDATE', 'EXAMS', `Updated exam: ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ success: false, message: 'Failed to update exam', error: error.message });
  }
};

const getExamRegistrations = async (req, res) => {
  try {
    const { examId, page = 1, limit = 20 } = req.params;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    const [registrations] = await connection.execute(
      `SELECT er.*, u.email, u.first_name, u.last_name, s.registration_number
       FROM exam_registrations er
       JOIN students s ON er.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE er.exam_id = ?
       ORDER BY u.first_name, u.last_name
       LIMIT ? OFFSET ?`,
      [examId, parseInt(limit), offset]
    );

    connection.release();
    res.json({ success: true, registrations, page, limit });
  } catch (error) {
    console.error('Get exam registrations error:', error);
    res.status(500).json({ success: false, message: 'Failed to get registrations', error: error.message });
  }
};

const allocateSeats = async (req, res) => {
  try {
    const { examId } = req.params;
    const { allocations } = req.body; // Array of { student_id, seat_number, room_number }
    const connection = await pool.getConnection();

    for (const allocation of allocations) {
      await connection.execute(
        'UPDATE exam_registrations SET seat_number = ?, room_number = ? WHERE exam_id = ? AND student_id = ?',
        [allocation.seat_number, allocation.room_number, examId, allocation.student_id]
      );
    }

    await logActivity(req.user.id, req.user.role, 'ALLOCATE', 'EXAMS', `Allocated seats for exam ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Seats allocated successfully' });
  } catch (error) {
    console.error('Allocate seats error:', error);
    res.status(500).json({ success: false, message: 'Failed to allocate seats', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { examId } = req.params;
    const { attendance_data } = req.body; // Array of { student_id, status }
    const connection = await pool.getConnection();

    for (const record of attendance_data) {
      await connection.execute(
        'UPDATE exam_registrations SET status = ? WHERE exam_id = ? AND student_id = ?',
        [record.status, examId, record.student_id]
      );
    }

    await logActivity(req.user.id, req.user.role, 'MARK', 'EXAMS', `Marked exam attendance for exam ${examId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance', error: error.message });
  }
};

const generateExamHall = async (req, res) => {
  try {
    const { examId } = req.params;
    const connection = await pool.getConnection();

    const [hallTickets] = await connection.execute(
      `SELECT er.*, e.exam_type, e.exam_date, e.location, e.duration_minutes,
              c.code, c.title, u.email, u.first_name, u.last_name, s.registration_number
       FROM exam_registrations er
       JOIN exams e ON er.exam_id = e.id
       JOIN courses c ON e.course_id = c.id
       JOIN students s ON er.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE er.exam_id = ? AND er.status IN ('registered', 'appeared')
       ORDER BY er.room_number, er.seat_number`,
      [examId]
    );

    connection.release();
    res.json({ success: true, hallTickets });
  } catch (error) {
    console.error('Generate exam hall error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate exam hall', error: error.message });
  }
};

module.exports = {
  getAllExams,
  createExam,
  updateExam,
  getExamRegistrations,
  allocateSeats,
  markAttendance,
  generateExamHall
};
