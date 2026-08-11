import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminService.getStudents({});
        setStudents(response.data.students);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div className="text-center py-8">Loading students...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Registration Number</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Program</th>
              <th className="px-4 py-2 text-left font-semibold">Admission Date</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{student.registration_number}</td>
                <td className="px-4 py-2">{student.user.first_name} {student.user.last_name}</td>
                <td className="px-4 py-2">{student.user.email}</td>
                <td className="px-4 py-2">{student.program_name}</td>
                <td className="px-4 py-2">{new Date(student.admission_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button className="btn btn-secondary text-xs py-1 px-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No students found</p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
