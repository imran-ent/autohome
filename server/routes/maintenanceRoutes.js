import { Router } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import {
  createMaintenance,
  getMyMaintenanceRequests,
  getAllMaintenanceRequests,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} from "../controllers/maintenanceController.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Attaches req.user if logged in, while still allowing guest submissions
const optionalProtect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch {
    // Ignore invalid/expired token for public booking form
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Customer routes
router.post("/", optionalProtect, upload.single("image"), createMaintenance);
router.get("/my-requests", protect, getMyMaintenanceRequests);
router.get("/my", protect, getMyMaintenanceRequests);

// Admin routes
router.get("/", protect, requireAdmin, getAllMaintenanceRequests);
router.put("/:id", protect, requireAdmin, updateMaintenanceRequest);
router.patch("/:id", protect, requireAdmin, updateMaintenanceRequest);
router.delete("/:id", protect, requireAdmin, deleteMaintenanceRequest);

export default router;