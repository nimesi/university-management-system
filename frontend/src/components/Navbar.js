import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">University Management</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FiUser className="w-5 h-5" />
          <span className="text-gray-700">{user?.first_name} {user?.last_name}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{user?.role?.toUpperCase()}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-danger flex items-center gap-2"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
