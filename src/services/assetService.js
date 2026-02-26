import API from './api';

const getAssets = (params) => API.get('/assets', { params });
const getMyAssets = (params) => API.get('/assets/my', { params });
const createAsset = (payload) => {
  const isFormData = payload instanceof FormData;
  return API.post('/assets', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
};

export default {
  getAssets,
  getMyAssets,
  createAsset,
};
