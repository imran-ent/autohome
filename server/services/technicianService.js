import api from "./api.js";

export const technicianService = {
  getAll: () => api.get("/technicians"),
  create: (data) => api.post("/technicians", data),
  update: (id, data) => api.put(`/technicians/${id}`, data),
  remove: (id) => api.delete(`/technicians/${id}`),
};