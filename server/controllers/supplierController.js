import asyncHandler from "../utils/asyncHandler.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

// @desc    Get all suppliers
// @route   GET /api/admin/suppliers
// @access  Private/Admin
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, suppliers);
});

// @desc    Create supplier
// @route   POST /api/admin/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  return sendSuccess(res, 201, supplier, "Supplier created successfully");
});

// @desc    Update supplier
// @route   PUT /api/admin/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!supplier) {
    return sendError(res, 404, "Supplier not found");
  }
  return sendSuccess(res, 200, supplier, "Supplier updated successfully");
});

// @desc    Delete supplier
// @route   DELETE /api/admin/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) {
    return sendError(res, 404, "Supplier not found");
  }
  return sendSuccess(res, 200, null, "Supplier deleted successfully");
});

export { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
