import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await studentService.getFees();
        setFees(response.data.fees);
      } catch (err) {
        setError('Failed to load fees');
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  if (loading) return <div className="text-center py-8">Loading fees...</div>;

  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.status === 'paid' ? f.amount : 0), 0);
  const totalPending = totalFees - totalPaid;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Fees</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Total Fees</p>
          <p className="text-3xl font-bold text-blue-600">₹{totalFees.toLocaleString()}</p>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Paid</p>
          <p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Fee Type</th>
              <th className="px-4 py-2 text-left font-semibold">Amount</th>
              <th className="px-4 py-2 text-left font-semibold">Due Date</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-semibold">{fee.fee_type}</td>
                <td className="px-4 py-2">₹{fee.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(fee.due_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    fee.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : fee.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {fee.status === 'pending' && (
                    <button className="btn btn-primary text-xs py-1 px-2">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fees.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No fees found</p>
        </div>
      )}
    </div>
  );
};

export default StudentFees;
