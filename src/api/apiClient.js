// src/apiClient.js
import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Add a request interceptor to attach the Bearer token automatically
apiClient.interceptors.request.use(
  (config) => {
    // Check if it's an admin or vendor route
    const isAdminRoute = config.url && config.url.startsWith('admins/');
    const isVendorRoute = config.url && config.url.startsWith('vendors/');
    
    // Get the appropriate token
    let token;
    if (isAdminRoute) {
      token = localStorage.getItem('adminToken');
    } else if (isVendorRoute) {
      token = localStorage.getItem('vendorToken');
    } else {
      token = localStorage.getItem('token') || localStorage.getItem('userToken');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Optional: Add a response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle unauthorized error globally (but not for login endpoints)
      if (error.response.status === 401) {
        const url = error.config?.url || '';
        const isLoginEndpoint = url.includes('/login');
        
        // Don't redirect on 401 for login endpoints - let the component handle it
        if (!isLoginEndpoint) {
          const isAdminRoute = url.startsWith('admins/');
          const isVendorRoute = url.startsWith('vendors/');
          
          if (isAdminRoute) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          } else if (isVendorRoute) {
            localStorage.removeItem('vendorToken');
            localStorage.removeItem('vendorRole');
            localStorage.removeItem('vendorType');
            window.location.href = '/vendorAuth/login';
          } else {
        localStorage.removeItem('token');
            localStorage.removeItem('userToken');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
