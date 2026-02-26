import API from './api';

const taskService = {
  getByProject: (projectId, params) =>
    API.get(`/tasks/project/${projectId}`, { params }),
  create: (projectId, data) => API.post(`/tasks/project/${projectId}`, data),
  getById: (id) => API.get(`/tasks/${id}`),
  update: (id, data) => API.patch(`/tasks/${id}`, data),
};

export default taskService;
