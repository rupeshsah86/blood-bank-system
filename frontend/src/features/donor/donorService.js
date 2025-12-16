import api from '../../api/axios';

export const donorService = {
  getDonors: async () => {
    const response = await api.get('/donors');
    return response.data;
  },

  addDonor: async (donorData) => {
    const response = await api.post('/donors', donorData);
    return response.data;
  }
};