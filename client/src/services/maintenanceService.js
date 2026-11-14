import api from "./api.js";

export const maintenanceService = {
  create: (data) => api.post("/maintenance", data),
  myRequests: () => api.get("/maintenance/my-requests"),
  getAll: (params) => api.get("/admin/maintenance", { params }),
  update: (id, data) => api.put(`/admin/maintenance/${id}`, data),
};
