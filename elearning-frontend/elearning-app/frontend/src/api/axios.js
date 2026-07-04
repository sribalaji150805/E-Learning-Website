// src/api/axios.js
// A central place to talk to our backend, so we don't repeat the base URL everywhere

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api"
  // Locally this falls back to localhost. On Vercel, we'll set VITE_API_URL
  // to your live Render backend URL (e.g. https://elearning-backend-4rew.onrender.com/api)
});

// Automatically attach the login token (if it exists) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
