import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import User from "../models/User.js";
import { sendSuccess } from "../utils/responseHelper.js";

// @desc    Dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingBookings = await Order.countDocuments({ status: "Pending" });

  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalStock = await Product.aggregate([
    { $group: { _id: null, total: { $sum: "$currentStock" } } },
  ]);
  const stock = totalStock.length > 0 ? totalStock[0].total : 0;

  const lowStockProducts = await Product.find({
    isActive: true,
    $expr: { $lte: [{ $subtract: ["$currentStock", "$reservedStock"] }, "$minStockLevel"] },
  });

  const maintenanceRequests = await MaintenanceRequest.countDocuments();
  const completedServices = await MaintenanceRequest.countDocuments({ status: "Resolved" });

  const totalCustomers = await User.countDocuments({ role: "customer" });

  return sendSuccess(res, 200, {
    totalOrders,
    availableProducts: totalProducts,
    totalStockQuantity: stock,
    lowStockProducts: lowStockProducts.length,
    pendingBookings,
    maintenanceRequests,
    completedServices,
    totalCustomers,
  });
});

// @desc    Daily sales chart
// @route   GET /api/admin/dashboard/sales-chart
// @access  Private/Admin
const getSalesChart = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const numDays = Number(days);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - numDays);

  const orders = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const chart = orders.map((day) => ({
    date: day._id,
    revenue: day.revenue,
    orders: day.count,
  }));

  return sendSuccess(res, 200, chart);
});

// @desc    Category sales
// @route   GET /api/admin/dashboard/category-sales
// @access  Private/Admin
const getCategorySales = asyncHandler(async (req, res) => {
  const categorySales = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.category",
        count: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return sendSuccess(res, 200, categorySales);
});

// @desc    Best selling products
// @route   GET /api/admin/dashboard/best-selling
// @access  Private/Admin
const getBestSelling = asyncHandler(async (req, res) => {
  const bestSelling = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.productName" },
        brand: { $first: "$items.brand" },
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]);

  return sendSuccess(res, 200, bestSelling);
});

export { getStats, getSalesChart, getCategorySales, getBestSelling };
