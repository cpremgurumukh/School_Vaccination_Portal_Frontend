import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:9095/api', // Your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: This tells Axios to send cookies (like JSESSIONID)
});

// Optional: Response interceptor for handling 401 errors globally
// This can still be useful.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API Client Interceptor: Unauthorized access - 401.');
      // If a session expires or becomes invalid, redirect to login.
      // Clear any local "logged-in" flags.
      localStorage.removeItem('isAuthenticated'); // We'll use this simple flag
      localStorage.removeItem('username');

      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
         window.location.href = '/login'; // Hard redirect
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;