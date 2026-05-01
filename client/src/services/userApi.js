import { api } from "./api.js";

export const userApi = {
  list: async (params = {}) => {
    const { data } = await api.get("/api/users", { params });
    return data;
  }
};

