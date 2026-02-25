import API from './api';

const getAssets = (params) => API.get('/assets', { params });
const createAsset = (payload) => API.post('/assets', payload);

export default {
  getAssets,
  createAsset,
};
