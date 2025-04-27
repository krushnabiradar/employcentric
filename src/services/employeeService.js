import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const employeeService = {
  async getAllEmployees() {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please check your permissions.');
      } else if (error.response?.status === 401) {
        throw new Error('Please log in to access this resource.');
      }
      throw error.response?.data?.error || 'Failed to fetch employees';
    }
  },

  async getEmployee(id) {
    try {
      const response = await axios.get(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch employee details';
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create employee';
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      const response = await axios.put(`${API_URL}/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update employee';
    }
  },

  async deleteEmployee(id) {
    try {
      const response = await axios.delete(`${API_URL}/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete employee';
    }
  },

  async getEmployeeStats() {
    try {
      const response = await axios.get(`${API_URL}/employees/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch employee statistics';
    }
  }
};

export default employeeService;
