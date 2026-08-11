const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getAllCourses = async (req, res) => {
  try {
    const { programId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT c.*, p.name as program_name, u.first_name, u.last_name 
                 FROM courses c 
                 LEFT JOIN programs p ON c.program_id = p.id 
                 LEFT JOIN lecturers l ON c.lecturer_id = l.id 
                 LEFT JOIN users u ON l.user_id = u.id 
                 WHERE c.status = 'active'`;
    const params = [];

    if (programId) {
      query += ' AND c.program_id = ?';
      params.push(programId);
    }

    query += ' ORDER BY c.code LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [courses] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, courses, page, limit });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to get courses', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const connection = await pool.getConnection();

    const [courses] = await connection.execute(
      `SELECT c.*, p.name as program_name, u.first_name, u.last_name 
       FROM courses c 
       LEFT JOIN programs p ON c.program_id = p.id 
       LEFT JOIN lecturers l ON c.lecturer_id = l.id 
       LEFT JOIN users u ON l.user_id = u.id 
       WHERE c.id = ?`,
      [courseId]
    );

    if (courses.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    connection.release();
    res.json({ success: true, course: courses[0] });
  } catch (error) {
    console.error('Get course by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to get course', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { code, title, description, program_id, semester, credit_hours, lecturer_id, max_students } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO courses (code, title, description, program_id, semester, credit_hours, lecturer_id, max_students, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [code, title, description, program_id, semester, credit_hours, lecturer_id, max_students, 'active']
    );

    await logActivity(req.user.id, req.user.role, 'CREATE', 'COURSES', `Created course: ${code}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Course created successfully', courseId: result.insertId });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, lecturer_id, max_students, status } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE courses SET title = ?, description = ?, lecturer_id = ?, max_students = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [title, description, lecturer_id, max_students, status, courseId]
    );

    await logActivity(req.user.id, req.user.role, 'UPDATE', 'COURSES', `Updated course: ${courseId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course', error: error.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;
    const connection = await pool.getConnection();

    const [existing] = await connection.execute(
      'SELECT id FROM course_enrollments WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
    }

    const [result] = await connection.execute(
      'INSERT INTO course_enrollments (student_id, course_id, status) VALUES (?, ?, ?)',
      [studentId, courseId, 'enrolled']
    );

    await logActivity(req.user.id, req.user.role, 'ENROLL', 'COURSES', `Enrolled student ${studentId} in course ${courseId}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ success: false, message: 'Failed to enroll student', error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollStudent
};
