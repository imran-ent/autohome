import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "/api";
const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, "")}/api`;  const api = axios.create({ baseURL: normalizedBaseUrl, headers: { "Content-Type": "application/json", }, });  api.interceptors.request.use((config) => { const token = localStorage.getItem("token"); if (token) { config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register") && !path.includes("/admin/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  adminLogin: (data) => api.post("/auth/admin/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const productService = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`), create: (data) => api.post("/products", data), update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`), updateStock: (id, data) => api.put(`/products/${id}/stock`, data),
};

export const orderService = {
  create: (data) => api.post("/orders", data),
  myOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`), getAll: (params) => api.get("/admin/orders", { params }), updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};

export const maintenanceService = {
  create: (data) => api.post("/maintenance", data),
  myRequests: () => api.get("/maintenance/my-requests"),
  getAll: (params) => api.get("/admin/maintenance", { params }),
  update: (id, data) => api.put(`/admin/maintenance/${id}`, data), };  export const inventoryService = { getAll: (params) => api.get("/admin/inventory", { params }), update: (id, data) => api.put(`/admin/inventory/${id}`, data),
  getStockTransactions: (params) => api.get("/admin/stock-transactions", { params }),
};

export const supplierService = {
  getAll: () => api.get("/admin/suppliers"),
  create: (data) => api.post("/admin/suppliers", data),
  update: (id, data) => api.put(`/admin/suppliers/${id}`, data), remove: (id) => api.delete(`/admin/suppliers/${id}`),
};

export const dashboardService = {
  getStats: () => api.get("/admin/dashboard/stats"),
  getSalesChart: (params) => api.get("/admin/dashboard/sales-chart", { params }),
  getCategorySales: () => api.get("/admin/dashboard/category-sales"),
  getBestSelling: () => api.get("/admin/dashboard/best-selling"),
};

export const aiService = {
  recommendBattery: (data) => api.post("/ai/recommend-battery", data),
};

export default api;