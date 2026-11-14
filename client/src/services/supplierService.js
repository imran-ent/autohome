import api from "./api.js";

export const supplierService = {
  getAll: () => api.get("/admin/suppliers"),
  create: (data) => api.post("/admin/suppliers", data),
  update: (id, data) => api.put(`/admin/suppliers/${id}`, data),
  remove: (id) => api.delete(`/admin/suppliers/${id}`),
};
