const pool = require('../config/database');

const getActivityLogs = async (req, res) => {
  try {
    const { user_id, action, module, page = 1, limit = 20, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params = [];

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }
    if (action) {
      query += ' AND action = ?';
      params.push(action);
    }
    if (module) {
      query += ' AND module = ?';
      params.push(module);
    }
    if (startDate) {
      query += ' AND DATE(created_at) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND DATE(created_at) <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [logs] = await connection.execute(query, params);
    connection.release();

    res.json({ success: true, logs, page, limit });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to get logs', error: error.message });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    const [logs] = await connection.execute(
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    connection.release();
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user activity', error: error.message });
  }
};

const getActivityStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const connection = await pool.getConnection();

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = ' WHERE DATE(created_at) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Actions count
    const [actionsCount] = await connection.execute(
      `SELECT action, COUNT(*) as count FROM activity_logs ${dateFilter} GROUP BY action`,
      params
    );

    // Modules count
    const [modulesCount] = await connection.execute(
      `SELECT module, COUNT(*) as count FROM activity_logs ${dateFilter} GROUP BY module`,
      params
    );

    // Users count
    const [usersCount] = await connection.execute(
      `SELECT user_role, COUNT(*) as count FROM activity_logs ${dateFilter} GROUP BY user_role`,
      params
    );

    connection.release();
    res.json({ success: true, actionsCount, modulesCount, usersCount });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stats', error: error.message });
  }
};

const exportActivityLogs = async (req, res) => {
  try {
    const { startDate, endDate, format } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND DATE(created_at) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND DATE(created_at) <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY created_at DESC';

    const [logs] = await connection.execute(query, params);
    connection.release();

    if (format === 'csv') {
      let csv = 'ID,User ID,User Role,Action,Module,Description,IP Address,Created At\n';
      logs.forEach(log => {
        csv += `${log.id},${log.user_id},${log.user_role},${log.action},${log.module},"${log.description}",${log.ip_address},${log.created_at}\n`;
      });
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename="activity_logs.csv"');
      res.send(csv);
    } else {
      res.json({ success: true, logs });
    }
  } catch (error) {
    console.error('Export activity logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to export logs', error: error.message });
  }
};

module.exports = {
  getActivityLogs,
  getUserActivity,
  getActivityStats,
  exportActivityLogs
};
