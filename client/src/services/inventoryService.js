import api from "./api.js";

export const inventoryService = {
  getAll: (params) => api.get("/admin/inventory", { params }),
  update: (id, data) => api.put(`/admin/inventory/${id}`, data),
  getStockTransactions: (params) => api.get("/admin/stock-transactions", { params }),
};
