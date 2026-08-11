import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await studentService.getExams();
        setExams(response.data.exams);
      } catch (err) {
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <div className="text-center py-8">Loading exams...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Exams</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Course Code</th>
              <th className="px-4 py-2 text-left font-semibold">Course Title</th>
              <th className="px-4 py-2 text-left font-semibold">Exam Date</th>
              <th className="px-4 py-2 text-left font-semibold">Time</th>
              <th className="px-4 py-2 text-left font-semibold">Venue</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{exam.code}</td>
                <td className="px-4 py-2">{exam.title}</td>
                <td className="px-4 py-2">{new Date(exam.exam_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{exam.exam_time}</td>
                <td className="px-4 py-2">{exam.venue}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    new Date(exam.exam_date) > new Date() 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(exam.exam_date) > new Date() ? 'Upcoming' : 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exams.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No exams scheduled</p>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
