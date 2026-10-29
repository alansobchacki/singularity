import axios from "axios";

export const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("authState");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
