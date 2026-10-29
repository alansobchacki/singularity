import axios from "axios";

export const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const wasAuthenticated = localStorage.getItem("authState")?.includes('"isAuthenticated":true');

    if (error.response?.status === 401 && wasAuthenticated) {
      localStorage.removeItem("authState");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
