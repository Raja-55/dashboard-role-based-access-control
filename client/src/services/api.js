import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again.";
    const fieldErrors = err?.response?.data?.errors || null;
    return Promise.reject({ ...err, friendlyMessage: message, fieldErrors });
  }
);
