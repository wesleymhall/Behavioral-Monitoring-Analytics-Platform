import axios from 'axios';
import { startLoading, stopLoading } from './LoadingService';

// import the base URL for API from env
const BASE_URL = import.meta.env.VITE_API_URL;

// create axios instance with the base URL
// withCredentials to allow session cookies to be sent with requests
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// add request interceptor to show loader
apiClient.interceptors.request.use(
  (config) => {
    startLoading();
    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

// add response interceptor to hide loader
apiClient.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

// export axios instance for import
export default apiClient;