import axios from "axios";

import { ACCESS_TOKEN_KEY, API_BASE_URL } from "@/lib/constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- outside React tree, no router available; full reload is intentional to clear state
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
