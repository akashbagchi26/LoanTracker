import axios from "axios";
import useAuthStore from "@/store/authStore";

// Base API URL
const BASE_URL = "http://192.168.0.103:5000/api";

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { message, response } = error;
    return Promise.reject({
      message: message || "Something went wrong",
      data: response?.data,
      status: response?.status,
    });
  },
);

export default apiClient;
