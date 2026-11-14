import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import { recommendBattery } from "../services/aiService.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

// @desc    Get AI battery recommendation
// @route   POST /api/ai/recommend-battery
// @access  Public
const recommendBatteryHandler = asyncHandler(async (req, res) => {
  const requirements = req.body;

  // Fetch active products from catalogue
  const products = await Product.find({ isActive: true }).lean();

  if (!products || products.length === 0) {
    return sendError(res, 404, "No products available for recommendation");
  }

  const result = await recommendBattery(products, requirements);

  return sendSuccess(res, 200, result);
});

export { recommendBatteryHandler };
