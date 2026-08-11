import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await adminService.getPrograms();
        setPrograms(response.data.programs);
      } catch (err) {
        setError('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) return <div className="text-center py-8">Loading programs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Programs Management</h1>
        <button className="btn btn-primary">Create Program</button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{program.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{program.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p><strong>Code:</strong> {program.code}</p>
              <p><strong>Duration:</strong> {program.duration} years</p>
              <p><strong>Department:</strong> {program.department}</p>
            </div>
            <button className="btn btn-secondary w-full text-sm">Edit Program</button>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No programs found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;
