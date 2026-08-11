import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentService.getCourses();
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
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-blue-600">{course.code}</p>
                <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Enrolled</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p><strong>Lecturer:</strong> {course.lecturer_name}</p>
              <p><strong>Credits:</strong> {course.credit_hours}</p>
              <p><strong>Semester:</strong> {course.semester}</p>
            </div>
            <button className="btn btn-primary w-full text-sm">
              View Course Details
            </button>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No courses enrolled yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
