import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await studentService.getResults();
        setResults(response.data.results);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="text-center py-8">Loading results...</div>;

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    const totalMarks = results.reduce((sum, r) => sum + (r.marks || 0), 0);
    return (totalMarks / results.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Results</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Courses Completed</p>
          <p className="text-3xl font-bold text-blue-600">{results.length}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Average Grade</p>
          <p className="text-3xl font-bold text-green-600">{calculateGPA()}%</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Course Code</th>
              <th className="px-4 py-2 text-left font-semibold">Course Title</th>
              <th className="px-4 py-2 text-left font-semibold">Marks Obtained</th>
              <th className="px-4 py-2 text-left font-semibold">Total Marks</th>
              <th className="px-4 py-2 text-left font-semibold">Percentage</th>
              <th className="px-4 py-2 text-left font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const percentage = (result.marks / result.total_marks * 100).toFixed(2);
              let gradeColor = 'text-gray-800';
              if (percentage >= 80) gradeColor = 'text-green-600';
              else if (percentage >= 60) gradeColor = 'text-blue-600';
              else if (percentage >= 40) gradeColor = 'text-orange-600';
              else gradeColor = 'text-red-600';

              return (
                <tr key={result.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{result.course_code}</td>
                  <td className="px-4 py-2">{result.course_title}</td>
                  <td className="px-4 py-2">{result.marks}</td>
                  <td className="px-4 py-2">{result.total_marks}</td>
                  <td className="px-4 py-2">{percentage}%</td>
                  <td className={`px-4 py-2 font-bold ${gradeColor}`}>{result.grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {results.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No results available yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
