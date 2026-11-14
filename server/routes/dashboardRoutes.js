import { Router } from "express";
import {
  getStats,
  getSalesChart,
  getCategorySales,
  getBestSelling,
} from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/stats", protect, admin, getStats);
router.get("/sales-chart", protect, admin, getSalesChart);
router.get("/category-sales", protect, admin, getCategorySales);
router.get("/best-selling", protect, admin, getBestSelling);

export default router;
