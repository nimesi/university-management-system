import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, courses, exams, results, fees] = await Promise.all([
          studentService.getProfile(),
          studentService.getCourses(),
          studentService.getExams(),
          studentService.getResults(),
          studentService.getFees(),
        ]);

        setDashboardData({
          profile: profile.data.student,
          courses: courses.data.courses,
          exams: exams.data.exams,
          results: results.data.results,
          fees: fees.data.fees,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Enrolled Courses</p>
          <p className="text-3xl font-bold text-blue-600">{dashboardData?.courses?.length || 0}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Upcoming Exams</p>
          <p className="text-3xl font-bold text-green-600">{dashboardData?.exams?.length || 0}</p>
        </div>
        <div className="card bg-purple-50 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm">Results Published</p>
          <p className="text-3xl font-bold text-purple-600">{dashboardData?.results?.length || 0}</p>
        </div>
        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm">Pending Fees</p>
          <p className="text-3xl font-bold text-orange-600">
            {dashboardData?.fees?.filter(f => f.status !== 'paid').length || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
          {dashboardData?.courses?.slice(0, 5).map((course) => (
            <div key={course.id} className="py-2 border-b last:border-b-0">
              <p className="font-semibold text-gray-800">{course.code} - {course.title}</p>
              <p className="text-sm text-gray-600">Credits: {course.credit_hours}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upcoming Exams</h2>
          {dashboardData?.exams?.slice(0, 5).map((exam) => (
            <div key={exam.id} className="py-2 border-b last:border-b-0">
              <p className="font-semibold text-gray-800">{exam.code} - {exam.title}</p>
              <p className="text-sm text-gray-600">{new Date(exam.exam_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
