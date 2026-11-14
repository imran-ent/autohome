import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import StockTransaction from "../models/StockTransaction.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { generateBookingId } from "../utils/generateId.js";

// @desc    Create battery booking/order
// @route   POST /api/orders
// @access  Private (customer)
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryPreference, deliveryAddress, shippingAddress, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return sendError(res, 400, "At least one item is required");
  }

  // Format delivery address from either deliveryAddress or shippingAddress
  const shipping = shippingAddress || {};
  const formattedAddress = deliveryAddress || {
    street: shipping.address || shipping.street || "",
    city: shipping.city || "",
    state: shipping.state || "Tamil Nadu",
    pincode: shipping.pincode || "",
  };
  const resolvedDeliveryPreference = deliveryPreference || (shipping.address ? "delivery" : "pickup");

  let totalAmount = 0;
  let gstAmount = 0;
  const orderItems = [];

  for (const item of items) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(item.product)) {
      product = await Product.findById(item.product);
    }
    if (!product) {
      product = await Product.findOne({ isActive: true });
    }

    if (!product) {
      return sendError(res, 404, `Product not found: ${item.product}`);
    }

    if (!product.isActive) {
      return sendError(res, 400, `${product.name} is not available`);
    }

    const quantity = Number(item.quantity) || 1;
    const available = product.availableStock;

    if (available < quantity) {
      if (!product.supplierAvailable && product.availableStock > 0) {
        return sendError(
          res,
          400,
          `Insufficient stock for ${product.name}. Available: ${available}`
        );
      }
    }

    const price = product.sellingPrice;
    const itemGst = Math.round((price * quantity * product.gstRate) / 100);

    totalAmount += price * quantity;
    gstAmount += itemGst;

    orderItems.push({
      product: product._id,
      productName: product.name,
      brand: product.brand,
      sku: product.sku,
      quantity,
      price,
      gstRate: product.gstRate,
    });

    // Reserve stock
    product.reservedStock = (product.reservedStock || 0) + quantity;
    await product.save();

    await StockTransaction.create({
      product: product._id,
      sku: product.sku,
      type: "reserve",
      quantity,
      referenceType: "order",
      notes: `Reserved for booking`,
      createdBy: req.user._id,
    });
  }

  const bookingId = generateBookingId();

  const order = await Order.create({
    customer: req.user._id,
    bookingId,
    items: orderItems,
    quantity: items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0),
    totalAmount,
    gstAmount,
    deliveryPreference: resolvedDeliveryPreference,
    deliveryAddress: formattedAddress,
    notes,
    status: "Pending",
    stockReserved: true,
  });

  return sendSuccess(res, 201, {
    order,
    bookingId,
    totalAmount,
    gstAmount,
  }, "Booking created successfully");
});

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private (customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({
    createdAt: -1,
  });
  return sendSuccess(res, 200, orders);
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customer",
    "name email mobile"
  );

  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  // Customers can only view their own orders
  if (
    req.user.role === "customer" &&
    order.customer._id.toString() !== req.user._id.toString()
  ) {
    return sendError(res, 403, "Not authorized to view this order");
  }

  return sendSuccess(res, 200, order);
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(filter)
    .populate("customer", "name email mobile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Order.countDocuments(filter);

  return sendSuccess(res, 200, {
    orders,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  const validStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Ready for Pickup",
    "Out for Delivery",
    "Completed",
    "Cancelled",
  ];

  if (!status || !validStatuses.includes(status)) {
    return sendError(res, 400, "Invalid status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return sendError(res, 404, "Order not found");
  }

  const previousStatus = order.status;
  order.status = status;

  if (paymentStatus && ["pending", "paid", "failed", "refunded"].includes(paymentStatus)) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus === "paid") {
      await Payment.updateMany(
        { order: order._id, status: { $ne: "paid" } },
        { status: "paid", paidAt: new Date(), verifiedBy: req.user?.name || "admin" }
      );
    }
  }

  // Stock logic
  if (status === "Completed" && previousStatus !== "Completed") {
    // Deduct reserved stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
        product.currentStock = Math.max(0, product.currentStock - item.quantity);
        await product.save();

        await StockTransaction.create({
          product: product._id,
          sku: product.sku,
          type: "out",
          quantity: item.quantity,
          referenceType: "order",
          referenceId: order._id,
          notes: `Stock deducted for completed order ${order.bookingId}`,
          createdBy: req.user._id,
        });
      }
    }
  }

  if (status === "Cancelled" && order.stockReserved) {
    // Release reserved stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
        await product.save();

        await StockTransaction.create({
          product: product._id,
          sku: product.sku,
          type: "release",
          quantity: item.quantity,
          referenceType: "order",
          referenceId: order._id,
          notes: `Stock released for cancelled order ${order.bookingId}`,
          createdBy: req.user._id,
        });
      }
    }
  }

  await order.save();

  return sendSuccess(res, 200, order, `Order status updated to ${status}`);
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
