import { api } from "./api.js";

export const taskApi = {
  list: async () => {
    const { data } = await api.get("/api/tasks");
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/tasks", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/tasks/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/tasks/${id}`);
    return data;
  }
};

