import axios from 'axios';

// It's generally better practice to retrieve `token` when the request is actually made,
// not when the module first loads, in case the token changes during the app's lifetime.
// However, if the token is only present in the initial URL query param and is static,
// this is fine. For dynamic tokens (e.g., from local storage or context),
// you'd access it inside the interceptor's config callback.
const urlParameters = new URLSearchParams(window.location.search);
const token = urlParameters.get('token'); // This token will be static from initial load

const HLBackendV1Api = axios.create({
  baseURL: process.env.BACKEND_API_URL, // Replace with your API base URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    // Optionally add a default authorization header here if the token is always present
    // and you prefer it as a default, though interceptor is more flexible for dynamic tokens.
    // 'Authorization': token ? `Bearer ${token}` : ''
  },
});

// --- Request Interceptor ---
// Intercepts requests before they are sent.
// Common use: Adding authentication headers.
HLBackendV1Api.interceptors.request.use( // <-- FIX IS HERE: Changed 'api' to 'HLBackendV1Api'
  (config) => {
    // Do something before request is sent
    // Example: Add an Authorization token from localStorage or a state management store
    // If 'token' can change after initial load (e.g., user logs in/out),
    // you should get it here instead of at the top of the file.
    // const dynamicToken = localStorage.getItem('authToken');
    // if (dynamicToken) {
    //   config.headers.Authorization = `Bearer ${dynamicToken}`;
    // } else if (token) { // Fallback to initial URL token if dynamic one isn't found
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Using the 'token' from the URL parameter as you originally intended:
    if (token) {
      //config.headers.Authorization = `Bearer ${token}`;
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

// --- Response Interceptor (Highly Recommended to add for error handling) ---
// You typically want a response interceptor to handle global error statuses (like 401, 403)
// or to transform data.
/*
HLBackendV1Api.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor (Success):', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Interceptor (Error):', error.response?.status, error.response?.config.url, error.message);
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request! Redirecting to login...");
      // e.g., window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/


// --- Export the configured Axios instance ---
export default HLBackendV1Api;
