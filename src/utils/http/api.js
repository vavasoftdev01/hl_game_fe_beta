import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// Intercepts requests before they are sent.
// Common use: Adding authentication headers.
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // Example: Add an Authorization token from localStorage or a state management store
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request Interceptor:', config.method?.toUpperCase(), config.url, config.headers);
    return config; // IMPORTANT: Always return the config object!
  },
  (error) => {
    // Do something with request error
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error); // IMPORTANT: Always return a rejected Promise for errors!
  }
);
// --- Export the configured Axios instance ---
export default api;
