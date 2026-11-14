import api from "./api.js";

export const aiService = {
  recommendBattery: (data) => api.post("/ai/recommend-battery", data),
};
