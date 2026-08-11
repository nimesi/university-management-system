import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth Services
export const authService = {
  login: (email, password) =>
    axios.post(`${API_BASE}/auth/login`, { email, password }),
  register: (userData) =>
    axios.post(`${API_BASE}/auth/register`, userData),
};

// Student Services
export const studentService = {
  getProfile: () =>
    axios.get(`${API_BASE}/student/profile`, { headers: getHeaders() }),
  updateProfile: (data) =>
    axios.put(`${API_BASE}/student/profile`, data, { headers: getHeaders() }),
  getCourses: () =>
    axios.get(`${API_BASE}/student/courses`, { headers: getHeaders() }),
  getExams: () =>
    axios.get(`${API_BASE}/student/exams`, { headers: getHeaders() }),
  getResults: () =>
    axios.get(`${API_BASE}/student/results`, { headers: getHeaders() }),
  getFees: () =>
    axios.get(`${API_BASE}/student/fees`, { headers: getHeaders() }),
};

// Lecturer Services
export const lecturerService = {
  getMyCourses: () =>
    axios.get(`${API_BASE}/lecturer/courses`, { headers: getHeaders() }),
  getStudentsInCourse: (courseId) =>
    axios.get(`${API_BASE}/lecturer/courses/${courseId}/students`, { headers: getHeaders() }),
  createAssignment: (courseId, data) =>
    axios.post(`${API_BASE}/lecturer/courses/${courseId}/assignments`, data, { headers: getHeaders() }),
  getAssignments: () =>
    axios.get(`${API_BASE}/lecturer/assignments`, { headers: getHeaders() }),
};

// Admin Services
export const adminService = {
  getUsers: (params) =>
    axios.get(`${API_BASE}/admin/users`, { headers: getHeaders(), params }),
  createUser: (userData) =>
    axios.post(`${API_BASE}/admin/users`, userData, { headers: getHeaders() }),
  updateUser: (userId, data) =>
    axios.put(`${API_BASE}/admin/users/${userId}`, data, { headers: getHeaders() }),
  deleteUser: (userId) =>
    axios.delete(`${API_BASE}/admin/users/${userId}`, { headers: getHeaders() }),
  getStudents: (params) =>
    axios.get(`${API_BASE}/admin/students`, { headers: getHeaders(), params }),
  getPrograms: () =>
    axios.get(`${API_BASE}/admin/programs`, { headers: getHeaders() }),
  createProgram: (data) =>
    axios.post(`${API_BASE}/admin/programs`, data, { headers: getHeaders() }),
  getApplications: (params) =>
    axios.get(`${API_BASE}/admin/applications`, { headers: getHeaders(), params }),
  reviewApplication: (appId, data) =>
    axios.put(`${API_BASE}/admin/applications/${appId}`, data, { headers: getHeaders() }),
};

// Activity Log Services
export const activityLogService = {
  getLogs: (params) =>
    axios.get(`${API_BASE}/admin/activity-logs`, { headers: getHeaders(), params }),
};

// Exam Services
export const examService = {
  createExam: (data) =>
    axios.post(`${API_BASE}/exams`, data, { headers: getHeaders() }),
  getExams: () =>
    axios.get(`${API_BASE}/exams`, { headers: getHeaders() }),
};
