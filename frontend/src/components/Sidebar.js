import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiClipboard, FiAward, FiDollarSign, FiUsers, FiSettings, FiActivity } from 'react-icons/fi';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const studentMenu = [
    { path: '/', label: 'Dashboard', icon: <FiHome /> },
    { path: '/student/profile', label: 'Profile', icon: <FiSettings /> },
    { path: '/student/courses', label: 'Courses', icon: <FiBook /> },
    { path: '/student/exams', label: 'Exams', icon: <FiClipboard /> },
    { path: '/student/results', label: 'Results', icon: <FiAward /> },
    { path: '/student/fees', label: 'Fees', icon: <FiDollarSign /> },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { path: '/admin/students', label: 'Students', icon: <FiBook /> },
    { path: '/admin/programs', label: 'Programs', icon: <FiClipboard /> },
    { path: '/admin/applications', label: 'Applications', icon: <FiAward /> },
    { path: '/admin/activity-logs', label: 'Activity Logs', icon: <FiActivity /> },
  ];

  const lecturerMenu = [
    { path: '/lecturer/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/lecturer/courses', label: 'My Courses', icon: <FiBook /> },
    { path: '/lecturer/assignments', label: 'Assignments', icon: <FiClipboard /> },
    { path: '/lecturer/exams', label: 'Exams', icon: <FiAward /> },
  ];

  const getMenu = () => {
    if (user?.role === 'student') return studentMenu;
    if (user?.role === 'admin') return adminMenu;
    if (user?.role === 'lecturer') return lecturerMenu;
    return [];
  };

  const menu = getMenu();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold">University Portal</h2>
      </div>
      <nav className="mt-6">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 border-r-4 border-blue-400'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
