import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentCourses from './pages/Student/Courses';
import StudentExams from './pages/Student/Exams';
import StudentResults from './pages/Student/Results';
import StudentFees from './pages/Student/Fees';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminStudents from './pages/Admin/Students';
import AdminPrograms from './pages/Admin/Programs';
import AdminApplications from './pages/Admin/Applications';
import AdminActivityLogs from './pages/Admin/ActivityLogs';

// Lecturer Pages
import LecturerDashboard from './pages/Lecturer/Dashboard';
import LecturerCourses from './pages/Lecturer/Courses';
import LecturerAssignments from './pages/Lecturer/Assignments';
import LecturerExams from './pages/Lecturer/Exams';

// Error Pages
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, user }) => {
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleRoute = ({ children, user, roles }) => {
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {auth?.user && (
          <Route
            path="/*"
            element={
              <div className="flex">
                <Sidebar user={auth.user} />
                <div className="flex-1 flex flex-col">
                  <Navbar user={auth.user} />
                  <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    <Routes>
                      {/* Student Routes */}
                      {auth.user.role === 'student' && (
                        <>
                          <Route
                            path="/"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentDashboard />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/student/profile"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentProfile />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/student/courses"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentCourses />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/student/exams"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentExams />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/student/results"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentResults />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/student/fees"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['student']}
                              >
                                <StudentFees />
                              </RoleRoute>
                            }
                          />
                        </>
                      )}

                      {/* Admin Routes */}
                      {auth.user.role === 'admin' && (
                        <>
                          <Route
                            path="/admin/dashboard"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminDashboard />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/admin/users"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminUsers />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/admin/students"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminStudents />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/admin/programs"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminPrograms />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/admin/applications"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminApplications />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/admin/activity-logs"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['admin']}
                              >
                                <AdminActivityLogs />
                              </RoleRoute>
                            }
                          />
                          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                        </>
                      )}

                      {/* Lecturer Routes */}
                      {auth.user.role === 'lecturer' && (
                        <>
                          <Route
                            path="/lecturer/dashboard"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['lecturer']}
                              >
                                <LecturerDashboard />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/lecturer/courses"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['lecturer']}
                              >
                                <LecturerCourses />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/lecturer/assignments"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['lecturer']}
                              >
                                <LecturerAssignments />
                              </RoleRoute>
                            }
                          />
                          <Route
                            path="/lecturer/exams"
                            element={
                              <RoleRoute
                                user={auth.user}
                                roles={['lecturer']}
                              >
                                <LecturerExams />
                              </RoleRoute>
                            }
                          />
                          <Route path="/" element={<Navigate to="/lecturer/dashboard" />} />
                        </>
                      )}

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        )}

        {/* Redirect to login if not authenticated */}
        {!auth?.user && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
