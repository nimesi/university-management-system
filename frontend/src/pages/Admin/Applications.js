import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await adminService.getApplications({});
        setApplications(response.data.applications);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleReview = async (appId, decision) => {
    try {
      await adminService.reviewApplication(appId, { status: decision, remarks: '' });
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: decision } : app
      ));
      setSelectedApp(null);
    } catch (err) {
      setError('Failed to update application');
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Applications Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Total Applications</p>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
        </div>
        <div className="card bg-yellow-50 border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === 'approved').length}
          </p>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-600">
          <p className="text-gray-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {applications.filter(a => a.status === 'rejected').length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Applicant Name</th>
              <th className="px-4 py-2 text-left font-semibold">Program</th>
              <th className="px-4 py-2 text-left font-semibold">Application Date</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{app.applicant_name}</td>
                <td className="px-4 py-2">{app.program_name}</td>
                <td className="px-4 py-2">{new Date(app.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="btn btn-secondary text-xs py-1 px-2"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Review Application</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Name:</strong> {selectedApp.applicant_name}</p>
              <p><strong>Program:</strong> {selectedApp.program_name}</p>
              <p><strong>Current Status:</strong> {selectedApp.status}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleReview(selectedApp.id, 'approved')}
                className="btn btn-primary flex-1"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview(selectedApp.id, 'rejected')}
                className="btn btn-danger flex-1"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
