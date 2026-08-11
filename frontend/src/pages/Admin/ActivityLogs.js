import React, { useState, useEffect } from 'react';
import { activityLogService } from '../../services/api';

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = filter !== 'all' ? { action_type: filter } : {};
        const response = await activityLogService.getLogs(params);
        setLogs(response.data.logs);
      } catch (err) {
        setError('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filter]);

  if (loading) return <div className="text-center py-8">Loading activity logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Activity Logs</h1>
        <button className="btn btn-secondary">Export Logs</button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="card">
        <label className="block text-gray-700 font-semibold mb-2">Filter by Action</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
        >
          <option value="all">All Actions</option>
          <option value="login">Login</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">User</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
              <th className="px-4 py-2 text-left font-semibold">Resource</th>
              <th className="px-4 py-2 text-left font-semibold">Timestamp</th>
              <th className="px-4 py-2 text-left font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{log.user_name}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    log.action_type === 'delete' ? 'bg-red-100 text-red-800' :
                    log.action_type === 'create' ? 'bg-green-100 text-green-800' :
                    log.action_type === 'update' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action_type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2">{log.resource_type}</td>
                <td className="px-4 py-2 text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No activity logs found</p>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;
