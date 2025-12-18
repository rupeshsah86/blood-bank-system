import api from '../../api/axios';

export const bloodService = {
  getBloodStock: async () => {
    const response = await api.get('/bloodbank');
    return response.data;
  },

  addBloodStock: async (stockData) => {
    const response = await api.post('/bloodbank', stockData);
    return response.data;
  },

  updateBloodStock: async (id, stockData) => {
    const response = await api.put(`/bloodbank/${id}`, stockData);
    return response.data;
  },

  createBloodRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getBloodRequests: async () => {
    const response = await api.get('/requests');
    return response.data;
  },

  updateRequestStatus: async (id, status) => {
    const response = await api.put(`/requests/${id}`, { status });
    return response.data;
  },

  getUserRequests: async () => {
    const response = await api.get('/requests/my');
    return response.data;
  }
};