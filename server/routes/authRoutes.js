import { Router } from "express";
import {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Customer auth
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Admin auth
router.post("/admin/login", loginAdmin);

// Profile (protected)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
