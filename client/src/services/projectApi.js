import { api } from "./api.js";

export const projectApi = {
  list: async () => {
    const { data } = await api.get("/api/projects");
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/api/projects", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/api/projects/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/api/projects/${id}`);
    return data;
  },
  addMembers: async (id, payload) => {
    const { data } = await api.post(`/api/projects/${id}/members`, payload);
    return data;
  }
};

