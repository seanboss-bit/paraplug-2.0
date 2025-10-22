import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL ?? "";

// ✅ Create a single axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ✅ Add request interceptor — fully typed & SSR-safe
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const token: string | undefined =
            parsedUser?.state?.user?.accessToken ?? undefined;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.warn("⚠️ Failed to parse user token:", error);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default api;
