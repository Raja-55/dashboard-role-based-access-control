import { api } from "./api.js";

export const authApi = {
  register: async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post("/api/auth/login", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
  logout: async () => {
    const { data } = await api.post("/api/auth/logout");
    return data;
  }
};

