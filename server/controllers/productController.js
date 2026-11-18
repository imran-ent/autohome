import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CATEGORY_ALIASES = {
  "Home Inverter": ["Home Inverter", "Inverters"],
  "Inverter Batteries": ["Inverter Batteries", "Home Inverter Batteries"],
  "Combo Home Inverter & Batteries": ["Combo Home Inverter & Batteries"],
  "Lithium Batteries": ["Lithium Batteries", "Lithium Battery"],
  "Two Wheeler": ["Two Wheeler", "Bike Batteries"],
  "Three Wheeler": ["Three Wheeler", "Truck / Commercial Batteries"],
  Car: ["Car", "Car Batteries"],
};

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    suitableFor,
    minAh,
    maxAh,
    minPrice,
    maxPrice,
    voltage,
    search,
    isActive,
    page = 1,
    limit = 50,
  } = req.query;

  const filter = {};

  if (category) {
    const mapped = CATEGORY_ALIASES[category];
    filter.category = mapped ? { $in: mapped } : category;
  }
  if (brand) filter.brand = new RegExp(escapeRegex(brand), "i");
  if (suitableFor) filter.suitableFor = new RegExp(escapeRegex(suitableFor), "i");
  if (voltage) filter.voltage = Number(voltage);
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (search) {
    const escapedSearch = escapeRegex(search);
    filter.$or = [
      { name: new RegExp(escapedSearch, "i") },
      { brand: new RegExp(escapedSearch, "i") },
      { sku: new RegExp(escapedSearch, "i") },
      { suitableFor: new RegExp(escapedSearch, "i") },
    ];
  }

  if (minAh || maxAh) {
    filter.ahCapacity = {};
    if (minAh) filter.ahCapacity.$gte = Number(minAh);
    if (maxAh) filter.ahCapacity.$lte = Number(maxAh);
  }

  if (minPrice || maxPrice) {
    filter.sellingPrice = {};
    if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(filter);

  return sendSuccess(res, 200, {
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, 404, "Product not found");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return sendError(res, 404, "Product not found");
  }

  return sendSuccess(res, 200, product);
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  return sendSuccess(res, 201, product, "Product created successfully");
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return sendError(res, 404, "Product not found");
  }

  return sendSuccess(res, 200, product, "Product updated successfully");
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return sendError(res, 404, "Product not found");
  }

  return sendSuccess(res, 200, null, "Product deleted successfully");
});

// @desc    Update stock (admin)
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { currentStock, minStockLevel, supplierAvailable, supplierLeadTime } =
    req.body;

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
    },
    "Stock updated successfully"
  );
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};