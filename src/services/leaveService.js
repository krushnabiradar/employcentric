import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const leaveService = {
  async getAllLeaves() {
    try {
      const response = await axios.get(`${API_URL}/leaves`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please check your permissions.');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to access this resource.');
      }
      throw error.response?.data?.error || 'Failed to fetch leaves';
    }
  },

  async getLeave(id) {
    try {
      const response = await axios.get(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch leave details';
    }
  },

  async createLeave(leaveData) {
    try {
      const response = await axios.post(`${API_URL}/leaves`, leaveData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create leave request';
    }
  },

  async updateLeave(id, leaveData) {
    try {
      const response = await axios.put(`${API_URL}/leaves/${id}`, leaveData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update leave request';
    }
  },

  async deleteLeave(id) {
    try {
      const response = await axios.delete(`${API_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete leave request';
    }
  },

  async getLeaveStats() {
    try {
      const response = await axios.get(`${API_URL}/leaves/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch leave statistics';
    }
  },

  async getTodayLeaves() {
    try {
      const response = await axios.get(`${API_URL}/leaves/today`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please check your permissions.');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to access this resource.');
      }
      throw error.response?.data?.error || 'Failed to fetch today\'s leaves';
    }
  }
};

export default leaveService;
