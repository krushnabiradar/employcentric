
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Get token from storage or user data
const getStoredToken = (): string | null => {
  try {
    // First try to get token directly from the login response
    const loginResponse = localStorage.getItem('loginResponse');
    if (loginResponse) {
      const parsed = JSON.parse(loginResponse);
      // The login response contains the token directly at the top level
      if (parsed && parsed.token) {
        return parsed.token;
      }
    }
    
    // Fallback: try to get token from document.cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    
    // Last resort: check if token is stored separately
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }
  } catch (e) {
    console.error('Error retrieving stored token:', e);
  }
  return null;
};

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Function to get auth header
const getAuthHeader = () => {
  const token = getStoredToken();
  return token ? `Bearer ${token}` : undefined;
};

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., session expired)
      console.error('Session expired or not authenticated');
      if (window.location.pathname !== '/login') {
        // Clear any stored user data
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden access (e.g., insufficient permissions)
      console.error('Access denied. Insufficient permissions.');
      // You might want to redirect to an error page or show a notification
    }
    
    // Log the error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to handle authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure credentials are sent with every request
    config.withCredentials = true;

    // Get token from all possible sources
    const token = getStoredToken();
    
    // Add Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Also set token as a custom header as a fallback
      config.headers['X-Auth-Token'] = token;
    }

    // Ensure cookies are properly sent
    if (!config.headers['X-Requested-With']) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    // Log cookie information for debugging
    const cookieString = document.cookie;
    console.log('Document cookies:', cookieString);
    
    // Log request details for debugging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      withCredentials: config.withCredentials,
      hasAuthHeader: !!config.headers['Authorization'],
      token: token ? `${token.substring(0, 10)}...` : 'none',
      cookies: cookieString
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle tokens
api.interceptors.response.use(
  (response) => {
    // Save token from response if present
    if (response.data?.token) {
      // Store the entire login response
      localStorage.setItem('loginResponse', JSON.stringify(response.data));
      
      // Also store token separately for redundancy
      localStorage.setItem('token', response.data.token);
      
      // Log successful token storage
      console.log('Token successfully stored from response');
    }
    
    // Check for Authorization header in response
    const authHeader = response.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      localStorage.setItem('token', token);
      console.log('Token extracted from Authorization header');
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      console.error('Authentication error (401):', error.response?.data);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
