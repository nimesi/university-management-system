const pool = require('../config/database');
const { logActivity, getClientIp } = require('../utils/activityLogger');

const getAllFees = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = `SELECT f.*, u.email, u.first_name, u.last_name, s.registration_number 
                 FROM fees f 
                 JOIN students s ON f.student_id = s.id 
                 JOIN users u ON s.user_id = u.id 
                 WHERE 1=1`;
    const params = [];

    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }

    query += ' ORDER BY f.semester DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [fees] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, fees, page, limit });
  } catch (error) {
    console.error('Get all fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to get fees', error: error.message });
  }
};

const createFeeStructure = async (req, res) => {
  try {
    const { student_id, semester, academic_year, fee_amount, description, due_date } = req.body;
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO fees (student_id, semester, academic_year, fee_amount, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_id, semester, academic_year, fee_amount, description, due_date, 'pending']
    );

    await logActivity(req.user.id, req.user.role, 'CREATE', 'FEES', `Created fee record for student ${student_id}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Fee structure created successfully', feeId: result.insertId });
  } catch (error) {
    console.error('Create fee structure error:', error);
    res.status(500).json({ success: false, message: 'Failed to create fee structure', error: error.message });
  }
};

const recordFeePayment = async (req, res) => {
  try {
    const { fee_id, amount, payment_method, transaction_id, receipt_number, notes } = req.body;
    const connection = await pool.getConnection();

    // Insert payment
    const [paymentResult] = await connection.execute(
      'INSERT INTO fee_payments (fee_id, amount, payment_method, transaction_id, receipt_number, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [fee_id, amount, payment_method, transaction_id, receipt_number, notes]
    );

    // Get fee details
    const [fees] = await connection.execute('SELECT * FROM fees WHERE id = ?', [fee_id]);
    const fee = fees[0];

    // Get total paid
    const [payments] = await connection.execute(
      'SELECT COALESCE(SUM(amount), 0) as total_paid FROM fee_payments WHERE fee_id = ?',
      [fee_id]
    );
    const totalPaid = payments[0].total_paid + amount;

    // Update fee status
    let newStatus = 'pending';
    if (totalPaid >= fee.fee_amount) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partially_paid';
    }

    await connection.execute(
      'UPDATE fees SET status = ? WHERE id = ?',
      [newStatus, fee_id]
    );

    await logActivity(req.user.id, req.user.role, 'PAYMENT', 'FEES', `Recorded payment for fee ${fee_id}`, getClientIp(req));

    connection.release();
    res.status(201).json({ success: true, message: 'Payment recorded successfully', paymentId: paymentResult.insertId });
  } catch (error) {
    console.error('Record fee payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment', error: error.message });
  }
};

const getFeePaymentHistory = async (req, res) => {
  try {
    const { feeId } = req.params;
    const connection = await pool.getConnection();

    const [payments] = await connection.execute(
      'SELECT * FROM fee_payments WHERE fee_id = ? ORDER BY payment_date DESC',
      [feeId]
    );

    connection.release();
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Get fee payment history error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment history', error: error.message });
  }
};

const getStudentFeeStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const connection = await pool.getConnection();

    const [fees] = await connection.execute(
      `SELECT f.*, COALESCE(SUM(fp.amount), 0) as paid_amount, 
              (f.fee_amount - COALESCE(SUM(fp.amount), 0)) as outstanding_amount
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
    console.error('Get student fee status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get fee status', error: error.message });
  }
};

const generateFeeReport = async (req, res) => {
  try {
    const { semester, academic_year } = req.query;
    const connection = await pool.getConnection();

    let query = `SELECT f.*, u.email, u.first_name, u.last_name, s.registration_number,
                        COALESCE(SUM(fp.amount), 0) as paid_amount,
                        (f.fee_amount - COALESCE(SUM(fp.amount), 0)) as outstanding_amount
                 FROM fees f
                 JOIN students s ON f.student_id = s.id
                 JOIN users u ON s.user_id = u.id
                 LEFT JOIN fee_payments fp ON f.id = fp.fee_id
                 WHERE 1=1`;
    const params = [];

    if (semester) {
      query += ' AND f.semester = ?';
      params.push(semester);
    }
    if (academic_year) {
      query += ' AND f.academic_year = ?';
      params.push(academic_year);
    }

    query += ' GROUP BY f.id ORDER BY f.student_id';

    const [report] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate fee report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
  }
};

module.exports = {
  getAllFees,
  createFeeStructure,
  recordFeePayment,
  getFeePaymentHistory,
  getStudentFeeStatus,
  generateFeeReport
};
