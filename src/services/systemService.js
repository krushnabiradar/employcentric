import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const systemService = {
  async getSystemStats() {
    try {
      const response = await axios.get(`${API_URL}/system/stats`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw error.response?.data?.error || 'Failed to fetch system stats';
    }
  },

  async getSystemAlerts() {
    try {
      const response = await axios.get(`${API_URL}/system/alerts`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw error.response?.data?.error || 'Failed to fetch system alerts';
    }
  },

  async getTenantGrowth() {
    try {
      const response = await axios.get(`${API_URL}/system/tenant-growth`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw error.response?.data?.error || 'Failed to fetch tenant growth data';
    }
  },

  async getSystemUsage() {
    try {
      const response = await axios.get(`${API_URL}/system/usage`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Superadmin access required.');
      }
      throw error.response?.data?.error || 'Failed to fetch system usage data';
    }
  }
};

export default systemService;
