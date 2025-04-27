
import axios from 'axios';

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensure cookies are sent with every request
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., session expired)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Log the error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to handle request preparation
api.interceptors.request.use(
  config => {
    console.log(`Request to: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
