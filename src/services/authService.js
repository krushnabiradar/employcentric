import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  },

  async logout() {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      throw error.response?.data?.error || 'Logout failed';
    }
  },

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/auth/current`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to get current user';
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  },

  async updateProfile(userData) {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Profile update failed';
    }
  },
};

export default authService;
