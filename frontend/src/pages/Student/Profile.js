import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentService.getProfile();
        setProfile(response.data.student);
        setFormData(response.data.student);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentService.updateProfile(formData);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Registration Number</label>
              <input
                type="text"
                value={formData.registration_number || ''}
                disabled
                className="input bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Admission Number</label>
              <input
                type="text"
                value={formData.admission_number || ''}
                disabled
                className="input bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Guardian Name</label>
              <input
                type="text"
                name="guardian_name"
                value={formData.guardian_name || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Guardian Phone</label>
              <input
                type="tel"
                name="guardian_phone"
                value={formData.guardian_phone || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
