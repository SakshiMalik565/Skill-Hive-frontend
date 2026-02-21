import API from './api';

const swapService = {
  getAll: (params) => API.get('/swaps', { params }),
  getById: (id) => API.get(`/swaps/${id}`),
  create: (data) => API.post('/swaps', data),
  update: (id, data) => API.put(`/swaps/${id}`, data),
  updateStatus: (id, status) => API.patch(`/swaps/${id}/status`, { status }),
  addFeedback: (id, data) => API.post(`/swaps/${id}/feedback`, data),
  delete: (id) => API.delete(`/swaps/${id}`),
  getMySwaps: () => API.get('/swaps/my'),
};

export default swapService;
