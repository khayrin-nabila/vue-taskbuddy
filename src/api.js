// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your backend URL
  timeout: 5000, // Optional: set a timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
