import { Router } from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/", protect, admin, getSuppliers);
router.post("/", protect, admin, createSupplier);
router.put("/:id", protect, admin, updateSupplier);
router.delete("/:id", protect, admin, deleteSupplier);

export default router;
