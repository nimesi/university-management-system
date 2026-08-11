import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const studentService = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getCourses: () => api.get('/students/courses'),
  getCourseMaterials: (courseId) => api.get(`/students/courses/${courseId}/materials`),
  getAssignments: (courseId) => api.get(`/students/courses/${courseId}/assignments`),
  submitAssignment: (assignmentId, data) => api.post(`/students/assignments/${assignmentId}/submit`, data),
  getAttendance: (courseId) => api.get(`/students/courses/${courseId}/attendance`),
  getExams: () => api.get('/students/exams'),
  registerExam: (examId) => api.post(`/students/exams/${examId}/register`),
  getResults: () => api.get('/students/results'),
  getFees: () => api.get('/students/fees'),
  getPayments: () => api.get('/students/payments'),
};

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStudents: (params) => api.get('/admin/students', { params }),
  updateStudentStatus: (studentId, data) => api.put(`/admin/students/${studentId}/status`, data),
  getPrograms: () => api.get('/admin/programs'),
  createProgram: (data) => api.post('/admin/programs', data),
  getApplications: (params) => api.get('/admin/applications', { params }),
  reviewApplication: (appId, data) => api.put(`/admin/applications/${appId}/review`, data),
};

export const lecturerService = {
  getProfile: () => api.get('/lecturers/profile'),
  updateProfile: (data) => api.put('/lecturers/profile', data),
  getMyCourses: () => api.get('/lecturers/courses'),
  getStudentsInCourse: (courseId) => api.get(`/lecturers/courses/${courseId}/students`),
  uploadMaterial: (courseId, data) => api.post(`/lecturers/courses/${courseId}/materials`, data),
  createAssignment: (courseId, data) => api.post(`/lecturers/courses/${courseId}/assignments`, data),
  getAssignmentSubmissions: (assignmentId) => api.get(`/lecturers/assignments/${assignmentId}/submissions`),
  gradeAssignment: (submissionId, data) => api.put(`/lecturers/submissions/${submissionId}/grade`, data),
  markAttendance: (courseId, data) => api.post(`/lecturers/courses/${courseId}/attendance`, data),
  getExamsForCourse: (courseId) => api.get(`/lecturers/courses/${courseId}/exams`),
  enterResults: (examId, data) => api.post(`/lecturers/exams/${examId}/results`, data),
};

export const coursesService = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (courseId, data) => api.put(`/courses/${courseId}`, data),
  enrollStudent: (courseId, data) => api.post(`/courses/${courseId}/enroll`, data),
};

export const feesService = {
  getAllFees: (params) => api.get('/fees', { params }),
  createFeeStructure: (data) => api.post('/fees', data),
  recordPayment: (data) => api.post('/fees/payment', data),
  getFeePaymentHistory: (feeId) => api.get(`/fees/${feeId}/payments`),
  getStudentFeeStatus: (studentId) => api.get(`/fees/student/${studentId}`),
  generateFeeReport: (params) => api.get('/fees/report/generate', { params }),
};

export const examService = {
  getAllExams: (params) => api.get('/exams', { params }),
  createExam: (data) => api.post('/exams', data),
  updateExam: (examId, data) => api.put(`/exams/${examId}`, data),
  getRegistrations: (examId) => api.get(`/exams/${examId}/registrations`),
  allocateSeats: (examId, data) => api.post(`/exams/${examId}/allocate-seats`, data),
  markAttendance: (examId, data) => api.post(`/exams/${examId}/mark-attendance`, data),
  generateHallTickets: (examId) => api.get(`/exams/${examId}/hall-tickets`),
};

export const resultsService = {
  getAllResults: (params) => api.get('/results', { params }),
  submitResult: (data) => api.post('/results', data),
  publishResults: (examId) => api.put(`/results/${examId}/publish`),
  getCourseResults: (params) => api.get('/results/course', { params }),
  compileCourseResults: (data) => api.post('/results/course/compile', data),
  generateTranscript: (studentId) => api.get(`/results/transcript/${studentId}`),
};

export const activityLogService = {
  getLogs: (params) => api.get('/activity-logs', { params }),
  getUserActivity: (userId) => api.get(`/activity-logs/user/${userId}`),
  getStats: (params) => api.get('/activity-logs/stats', { params }),
  exportLogs: (params) => api.get('/activity-logs/export', { params }),
};

export default api;
