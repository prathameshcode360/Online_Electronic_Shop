import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3500/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or sessionStorage)
    const token = localStorage.getItem("token");

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
