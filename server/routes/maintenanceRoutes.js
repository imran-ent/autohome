import { Router } from "express";
import {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
  getAllMaintenance,
  updateMaintenance,
} from "../controllers/maintenanceController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = Router();

// Public/customer
router.post("/", createMaintenanceRequest);
router.get("/my-requests", protect, getMyMaintenanceRequests);

// Admin
router.get("/", protect, admin, getAllMaintenance);
router.put("/:id", protect, admin, updateMaintenance);

export default router;
