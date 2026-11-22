import api from "./api.js";

export const maintenanceService = {
  create: (data) =>
    api.post(
      "/maintenance",
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {}
    ),
  myRequests: () => api.get("/maintenance/my-requests"),
  getAll: (params) => api.get("/maintenance", { params }),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  remove: (id) => api.delete(`/maintenance/${id}`),
};