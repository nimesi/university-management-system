const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { logActivity, getClientIp } = require('../utils/activityLogger');

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = 'SELECT id, email, first_name, last_name, role, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [users] = await connection.execute(query, params);

    connection.release();
    res.json({ success: true, users, page, limit });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;
    const connection = await pool.getConnection();

    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    const [result] = await connection.execute(
      'INSERT INTO users (email, password, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, first_name, last_name, role, 'active']
    );

    await logActivity(req.user.id, req.user.role, 'CREATE', 'USERS', `Created user: ${email}`, getClientIp(req));

    connection.release();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, phone, status } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [first_name, last_name, phone, status, userId]
    );

    await logActivity(req.user.id, req.user.role, 'UPDATE', 'USERS', `Updated user: ${userId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    await logActivity(req.user.id, req.user.role, 'DELETE', 'USERS', `Deleted user: ${userId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// Student Management
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT s.*, u.email, u.first_name, u.last_name, p.name as program_name 
                 FROM students s 
                 JOIN users u ON s.user_id = u.id 
                 LEFT JOIN programs p ON s.program_id = p.id 
                 WHERE 1=1`;
    const params = [];

    if (status) {
      query += ' AND s.admission_status = ?';
      params.push(status);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [students] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, students, page, limit });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ success: false, message: 'Failed to get students', error: error.message });
  }
};

const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { admission_status } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE students SET admission_status = ?, updated_at = NOW() WHERE id = ?',
      [admission_status, studentId]
    );

    await logActivity(req.user.id, req.user.role, 'UPDATE', 'STUDENTS', `Updated student status: ${studentId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Student status updated successfully' });
  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

// Program Management
const getAllPrograms = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [programs] = await connection.execute(
      'SELECT * FROM programs WHERE status = "active" ORDER BY name'
    );
    connection.release();
    res.json({ success: true, programs });
  } catch (error) {
    console.error('Get all programs error:', error);
    res.status(500).json({ success: false, message: 'Failed to get programs', error: error.message });
  }
};

const createProgram = async (req, res) => {
  try {
    const { name, code, description, duration_years, total_semesters } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO programs (name, code, description, duration_years, total_semesters, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, code, description, duration_years, total_semesters, 'active']
    );

    await logActivity(req.user.id, req.user.role, 'CREATE', 'PROGRAMS', `Created program: ${name}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Program created successfully', programId: result.insertId });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ success: false, message: 'Failed to create program', error: error.message });
  }
};

// Admission Applications
const getAdmissionApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = 'SELECT aa.*, p.name as program_name FROM admission_applications aa LEFT JOIN programs p ON aa.program_id = p.id WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND aa.status = ?';
      params.push(status);
    }

    query += ' ORDER BY aa.application_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [applications] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, applications, page, limit });
  } catch (error) {
    console.error('Get admission applications error:', error);
    res.status(500).json({ success: false, message: 'Failed to get applications', error: error.message });
  }
};

const reviewAdmissionApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, comments } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE admission_applications SET status = ?, comments = ?, reviewer_id = ?, review_date = NOW() WHERE id = ?',
      [status, comments, req.user.id, applicationId]
    );

    await logActivity(req.user.id, req.user.role, 'REVIEW', 'ADMISSIONS', `Reviewed application: ${applicationId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Application reviewed successfully' });
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ success: false, message: 'Failed to review application', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllStudents,
  updateStudentStatus,
  getAllPrograms,
  createProgram,
  getAdmissionApplications,
  reviewAdmissionApplication
};
