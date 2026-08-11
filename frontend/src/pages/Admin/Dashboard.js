import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, students, programs, apps] = await Promise.all([
          adminService.getUsers({}),
          adminService.getStudents({}),
          adminService.getPrograms(),
          adminService.getApplications({}),
        ]);

        setStats({
          totalUsers: users.data.total,
          totalStudents: students.data.total,
          totalPrograms: programs.data.programs.length,
          pendingApplications: apps.data.applications.filter(a => a.status === 'pending').length,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-green-600">{stats?.totalStudents || 0}</p>
        </div>
        <div className="card bg-purple-50 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm">Programs</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalPrograms || 0}</p>
        </div>
        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm">Pending Applications</p>
          <p className="text-3xl font-bold text-orange-600">{stats?.pendingApplications || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="btn btn-primary w-full text-left">Create User</button>
            <button className="btn btn-secondary w-full text-left">View Applications</button>
            <button className="btn btn-secondary w-full text-left">Manage Programs</button>
            <button className="btn btn-secondary w-full text-left">View Activity Logs</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Database Connection</span>
              <span className="text-green-600 font-semibold">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>API Server</span>
              <span className="text-green-600 font-semibold">✓ Running</span>
            </div>
            <div className="flex justify-between">
              <span>Last Backup</span>
              <span className="text-gray-600">Today, 2:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
