import asyncHandler from "../utils/asyncHandler.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import User from "../models/User.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import { generateRequestId } from "../utils/generateId.js";

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Public (customer or guest)
const createMaintenanceRequest = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerMobile,
    address,
    batteryCategory,
    batteryBrand,
    batteryModel,
    purchaseDate,
    problemDescription,
    preferredVisitTime,
    image,
  } = req.body;

  if (
    !customerName ||
    !customerMobile ||
    !address ||
    !batteryCategory ||
    !problemDescription
  ) {
    return sendError(res, 400, "Please fill all required fields");
  }

  // Try to link to logged-in customer if available
  let customer = null;
  if (req.user && req.user.role === "customer") {
    customer = req.user._id;
  }

  const requestId = generateRequestId();

  const maintenance = await MaintenanceRequest.create({
    requestId,
    customer,
    customerName,
    customerMobile,
    address,
    batteryCategory,
    batteryBrand,
    batteryModel,
    purchaseDate: purchaseDate || null,
    problemDescription,
    preferredVisitTime,
    image,
    status: "Requested",
  });

  return sendSuccess(
    res,
    201,
    {
      maintenance,
      requestId,
    },
    "Maintenance request submitted successfully"
  );
});

// @desc    Get my maintenance requests
// @route   GET /api/maintenance/my-requests
// @access  Private (customer)
const getMyMaintenanceRequests = asyncHandler(async (req, res) => {
  let query;
  if (req.user && req.user.role === "customer") {
    query = { customer: req.user._id };
  } else {
    return sendError(res, 403, "Not authorized");
  }

  const requests = await MaintenanceRequest.find(query).sort({
    createdAt: -1,
  });
  return sendSuccess(res, 200, requests);
});

// @desc    Get all maintenance requests (admin)
// @route   GET /api/admin/maintenance
// @access  Private/Admin
const getAllMaintenance = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const requests = await MaintenanceRequest.find(filter).sort({
    createdAt: -1,
  });
  return sendSuccess(res, 200, requests);
});

// @desc    Update maintenance request (admin)
// @route   PUT /api/admin/maintenance/:id
// @access  Private/Admin
const updateMaintenance = asyncHandler(async (req, res) => {
  const {
    status,
    assignedTechnician,
    scheduledDate,
    technicianRemarks,
    serviceCharge,
  } = req.body;

  const maintenance = await MaintenanceRequest.findById(req.params.id);

  if (!maintenance) {
    return sendError(res, 404, "Maintenance request not found");
  }

  if (status) maintenance.status = status;
  if (assignedTechnician !== undefined)
    maintenance.assignedTechnician = assignedTechnician;
  if (scheduledDate) maintenance.scheduledDate = new Date(scheduledDate);
  if (technicianRemarks !== undefined)
    maintenance.technicianRemarks = technicianRemarks;
  if (serviceCharge !== undefined)
    maintenance.serviceCharge = Number(serviceCharge);

  if (status === "Resolved" && !maintenance.resolvedAt) {
    maintenance.resolvedAt = new Date();
  }

  await maintenance.save();

  return sendSuccess(res, 200, maintenance, "Maintenance request updated");
});

export {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
  getAllMaintenance,
  updateMaintenance,
};
