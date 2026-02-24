import API from './api';

const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  sendOtp: (email) => API.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => API.post('/auth/verify-otp', { email, otp }),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (data) => API.post('/auth/reset-password', data),
};

export default authService;
