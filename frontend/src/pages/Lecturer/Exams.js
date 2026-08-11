import React, { useState, useEffect } from 'react';
import { examService } from '../../services/api';

const LecturerExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    exam_date: '',
    exam_time: '',
    duration: '',
    total_marks: '',
    venue: '',
  });

  useEffect(() => {
    // Fetch exams
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await examService.createExam(formData);
      setFormData({
        course_id: '',
        title: '',
        exam_date: '',
        exam_time: '',
        duration: '',
        total_marks: '',
        venue: '',
      });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create exam');
    }
  };

  if (loading) return <div className="text-center py-8">Loading exams...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Exams</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Schedule Exam'}
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
              <label className="block text-gray-700 font-semibold mb-2">Exam Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Exam Date</label>
                <input
                  type="date"
                  name="exam_date"
                  value={formData.exam_date}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Exam Time</label>
                <input
                  type="time"
                  name="exam_time"
                  value={formData.exam_time}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Total Marks</label>
                <input
                  type="number"
                  name="total_marks"
                  value={formData.total_marks}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Schedule Exam
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Title</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">Time</th>
              <th className="px-4 py-2 text-left font-semibold">Venue</th>
              <th className="px-4 py-2 text-left font-semibold">Total Marks</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{exam.title}</td>
                <td className="px-4 py-2">{new Date(exam.exam_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{exam.exam_time}</td>
                <td className="px-4 py-2">{exam.venue}</td>
                <td className="px-4 py-2">{exam.total_marks}</td>
                <td className="px-4 py-2">
                  <button className="btn btn-secondary text-xs py-1 px-2">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exams.length === 0 && !showForm && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No exams scheduled yet</p>
        </div>
      )}
    </div>
  );
};

export default LecturerExams;
