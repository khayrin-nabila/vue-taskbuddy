import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the environment variable
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});