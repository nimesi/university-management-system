import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentCourses from './pages/Student/Courses';
import StudentExams from './pages/Student/Exams';
import StudentResults from './pages/Student/Results';
import StudentFees from './pages/Student/Fees';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminStudents from './pages/Admin/Students';
import AdminPrograms from './pages/Admin/Programs';
import AdminApplications from './pages/Admin/Applications';
import AdminActivityLogs from './pages/Admin/ActivityLogs';
import LecturerDashboard from './pages/Lecturer/Dashboard';
import LecturerCourses from './pages/Lecturer/Courses';
import LecturerAssignments from './pages/Lecturer/Assignments';
import LecturerExams from './pages/Lecturer/Exams';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!auth) return <Navigate to="/login" />;
    if (requiredRole && auth.user.role !== requiredRole) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        {auth ? (
          <div className="flex h-screen bg-gray-100">
            <Sidebar user={auth.user} />
            <div className="flex flex-col flex-1">
              <Navbar user={auth.user} />
              <main className="flex-1 overflow-auto p-6">
                <Routes>
                  {/* Student Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/profile"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/courses"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentCourses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/exams"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentExams />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/results"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentResults />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/student/fees"
                    element={
                      <ProtectedRoute requiredRole="student">
                        <StudentFees />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/students"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminStudents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/programs"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPrograms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/applications"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/activity-logs"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminActivityLogs />
                      </ProtectedRoute>
                    }
                  />

                  {/* Lecturer Routes */}
                  <Route
                    path="/lecturer/dashboard"
                    element={
                      <ProtectedRoute requiredRole="lecturer">
                        <LecturerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lecturer/courses"
                    element={
                      <ProtectedRoute requiredRole="lecturer">
                        <LecturerCourses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lecturer/assignments"
                    element={
                      <ProtectedRoute requiredRole="lecturer">
                        <LecturerAssignments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lecturer/exams"
                    element={
                      <ProtectedRoute requiredRole="lecturer">
                        <LecturerExams />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
