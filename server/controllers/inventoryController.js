import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import StockTransaction from "../models/StockTransaction.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

// @desc    Get inventory list
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getInventory = asyncHandler(async (req, res) => {
  const { category, lowStock } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (lowStock === "true") {
    filter.$expr = {
      $lte: [{ $subtract: ["$currentStock", "$reservedStock"] }, "$minStockLevel"],
    };
  }

  const products = await Product.find(filter).sort({ currentStock: 1 });
  return sendSuccess(res, 200, products);
});

// @desc    Update inventory item stock
// @route   PUT /api/admin/inventory/:id
// @access  Private/Admin
const updateInventory = asyncHandler(async (req, res) => {
  const { currentStock, minStockLevel, supplierAvailable, supplierLeadTime } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return sendError(res, 404, "Product not found");
  }

  const previousStock = product.currentStock;

  if (currentStock !== undefined) product.currentStock = Number(currentStock);
  if (minStockLevel !== undefined)
    product.minStockLevel = Number(minStockLevel);
  if (supplierAvailable !== undefined)
    product.supplierAvailable = supplierAvailable === true;
  if (supplierLeadTime !== undefined)
    product.supplierLeadTime = supplierLeadTime;

  await product.save();

  return sendSuccess(
    res,
    200,
    {
      sku: product.sku,
      name: product.name,
      previousStock,
      currentStock: product.currentStock,
      availableStock: product.availableStock,
      stockStatus: product.stockStatus,
    },
    "Inventory updated successfully"
  );
});

// @desc    Get stock transactions
// @route   GET /api/admin/stock-transactions
// @access  Private/Admin
const getStockTransactions = asyncHandler(async (req, res) => {
  const { product, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (product) filter.product = product;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const transactions = await StockTransaction.find(filter)
    .populate("product", "name sku")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await StockTransaction.countDocuments(filter);

  return sendSuccess(res, 200, {
    transactions,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

export { getInventory, updateInventory, getStockTransactions };
