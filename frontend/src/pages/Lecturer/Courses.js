import React, { useState, useEffect } from 'react';
import { lecturerService } from '../../services/api';

const LecturerCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await lecturerService.getMyCourses();
        setCourses(response.data.courses);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center py-8">Loading courses...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{course.code} - {course.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p><strong>Semester:</strong> {course.semester}</p>
              <p><strong>Credits:</strong> {course.credit_hours}</p>
              <p><strong>Students Enrolled:</strong> {course.enrollment_count || 0}</p>
            </div>
            <div className="space-y-2">
              <button className="btn btn-primary w-full text-sm">Manage Course</button>
              <button className="btn btn-secondary w-full text-sm">View Students</button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No courses assigned</p>
        </div>
      )}
    </div>
  );
};

export default LecturerCourses;
