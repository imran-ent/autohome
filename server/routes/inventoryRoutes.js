import { Router } from "express";
import {
  getInventory,
  updateInventory,
  getStockTransactions,
} from "../controllers/inventoryController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/", protect, admin, getInventory);
router.put("/:id", protect, admin, updateInventory);
router.get("/stock-transactions", protect, admin, getStockTransactions);

export default router;
