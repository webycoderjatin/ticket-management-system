import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? '/api' // Use a relative path for production on Vercel
  : import.meta.env.VITE_API_BASE_URL; // Use the .env variable for local development

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;