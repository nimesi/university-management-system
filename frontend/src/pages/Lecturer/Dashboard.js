import React, { useState, useEffect } from 'react';
import { lecturerService } from '../../services/api';

const LecturerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const courses = await lecturerService.getMyCourses();
        
        let totalStudents = 0;
        let totalAssignments = 0;
        
        for (const course of courses.data.courses) {
          const students = await lecturerService.getStudentsInCourse(course.id);
          totalStudents += students.data.students.length;
        }

        setStats({
          totalCourses: courses.data.courses.length,
          totalStudents,
          totalAssignments: totalAssignments,
        });
      } catch (error) {
        console.error('Error fetching lecturer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Lecturer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">My Courses</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalCourses || 0}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-green-600">{stats?.totalStudents || 0}</p>
        </div>
        <div className="card bg-purple-50 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm">Assignments</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalAssignments || 0}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="btn btn-primary text-left">Create Assignment</button>
          <button className="btn btn-secondary text-left">Create Exam</button>
          <button className="btn btn-secondary text-left">Upload Course Material</button>
          <button className="btn btn-secondary text-left">View Student Progress</button>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
