const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getAllCourseMaterials = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM course_materials WHERE 1=1';
    const params = [];

    if (courseId) {
      query += ' AND course_id = ?';
      params.push(courseId);
    }

    query += ' ORDER BY upload_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [materials] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, materials, page, limit });
  } catch (error) {
    console.error('Get all course materials error:', error);
    res.status(500).json({ success: false, message: 'Failed to get materials', error: error.message });
  }
};

const uploadMaterial = async (req, res) => {
  try {
    const { title, description, file_path, material_type, course_id } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO course_materials (course_id, title, description, file_path, material_type) VALUES (?, ?, ?, ?, ?)',
      [course_id, title, description, file_path, material_type]
    );

    await logActivity(req.user.id, req.user.role, 'UPLOAD', 'LMS', `Uploaded material: ${title}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Material uploaded successfully', materialId: result.insertId });
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload material', error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const connection = await pool.getConnection();

    await connection.execute('DELETE FROM course_materials WHERE id = ?', [materialId]);
    await logActivity(req.user.id, req.user.role, 'DELETE', 'LMS', `Deleted material: ${materialId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete material', error: error.message });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM assignments WHERE 1=1';
    const params = [];

    if (courseId) {
      query += ' AND course_id = ?';
      params.push(courseId);
    }

    query += ' ORDER BY due_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [assignments] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, assignments, page, limit });
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get assignments', error: error.message });
  }
};

const getAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const connection = await pool.getConnection();

    const [assignments] = await connection.execute(
      'SELECT * FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (assignments.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const [submissions] = await connection.execute(
      `SELECT asb.*, u.email, u.first_name, u.last_name
       FROM assignment_submissions asb
       JOIN students s ON asb.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE asb.assignment_id = ?`,
      [assignmentId]
    );

    connection.release();
    res.json({ success: true, assignment: assignments[0], submissions });
  } catch (error) {
    console.error('Get assignment details error:', error);
    res.status(500).json({ success: false, message: 'Failed to get assignment details', error: error.message });
  }
};

const closeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE assignments SET status = "closed" WHERE id = ?',
      [assignmentId]
    );

    await logActivity(req.user.id, req.user.role, 'CLOSE', 'LMS', `Closed assignment: ${assignmentId}`, getClientIp(req));

    connection.release();
    res.json({ success: true, message: 'Assignment closed successfully' });
  } catch (error) {
    console.error('Close assignment error:', error);
    res.status(500).json({ success: false, message: 'Failed to close assignment', error: error.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT a.*, u.email, u.first_name, u.last_name
                 FROM attendance a
                 JOIN students s ON a.student_id = s.id
                 JOIN users u ON s.user_id = u.id
                 WHERE 1=1`;
    const params = [];

    if (courseId) {
      query += ' AND a.course_id = ?';
      params.push(courseId);
    }

    query += ' ORDER BY a.class_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [attendance] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, attendance, page, limit });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ success: false, message: 'Failed to get attendance report', error: error.message });
  }
};

module.exports = {
  getAllCourseMaterials,
  uploadMaterial,
  deleteMaterial,
  getAllAssignments,
  getAssignmentDetails,
  closeAssignment,
  getAttendanceReport
};
