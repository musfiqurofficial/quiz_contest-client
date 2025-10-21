import axios from "axios";
import { api } from "@/data/api";

// Create axios instance with auth header
export const authAxios = axios.create({
  baseURL: api,
});

// Add auth token to all requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default authAxios;
