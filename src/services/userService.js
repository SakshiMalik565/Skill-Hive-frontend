import API from './api';

const userService = {
  getAll: (params) => API.get('/users', { params }),
  getById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  uploadProfilePic: (formData) =>
    API.post('/users/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  searchBySkill: (skill) => API.get(`/users/search?skill=${skill}`),
};

export default userService;
