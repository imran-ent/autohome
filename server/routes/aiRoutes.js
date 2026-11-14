import { Router } from "express";
import { recommendBatteryHandler } from "../controllers/aiController.js";

const router = Router();

router.post("/recommend-battery", recommendBatteryHandler);

export default router;
