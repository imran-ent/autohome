import api from "./api.js";

export const dashboardService = {
  getStats: () => api.get("/admin/dashboard/stats"),
  getSalesChart: (params) => api.get("/admin/dashboard/sales-chart", { params }),
  getCategorySales: () => api.get("/admin/dashboard/category-sales"),
  getBestSelling: () => api.get("/admin/dashboard/best-selling"),
};
