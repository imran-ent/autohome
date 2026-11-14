import api from "./api.js";

export const orderService = {
  create: (data) => api.post("/orders", data),
  myOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get("/admin/orders", { params }),
  updateStatus: (id, status, paymentStatus) => api.put(`/admin/orders/${id}/status`, { status, paymentStatus }),
};
