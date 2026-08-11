import React, { useState, useEffect } from 'react';
import { lecturerService } from '../../services/api';

const LecturerAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
  });

  useEffect(() => {
    // Fetch assignments
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lecturerService.createAssignment(formData.course_id, formData);
      setFormData({ title: '', description: '', course_id: '', due_date: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  if (loading) return <div className="text-center py-8">Loading assignments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Assignment Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Assignment
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{assignment.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p><strong>Due:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
              <p><strong>Course:</strong> {assignment.course_code}</p>
            </div>
            <button className="btn btn-secondary w-full text-sm">
              View Submissions
            </button>
          </div>
        ))}
      </div>

      {assignments.length === 0 && !showForm && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No assignments created yet</p>
        </div>
      )}
    </div>
  );
};

export default LecturerAssignments;
