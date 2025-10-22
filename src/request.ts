import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 🌍 Single Axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 🧠 Interceptor — attach token only if it exists
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token =
      JSON.parse(localStorage?.getItem("user"))?.state?.user?.accessToken || "";
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // standard header name
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
