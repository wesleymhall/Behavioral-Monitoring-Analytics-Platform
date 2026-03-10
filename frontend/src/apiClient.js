import axios from 'axios';

// import the base URL for API from env
const BASE_URL = import.meta.env.VITE_API_URL;

// create axios instance with the base URL
// withCredentials to allow session cookies to be sent with requests
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// export axios instance for import
export default apiClient;