import Maintenance from "../models/Maintenance.js";

const parseAddressField = (rawAddress) => {
  if (!rawAddress) return null;
  if (typeof rawAddress === "object") return rawAddress;
  if (typeof rawAddress === "string") {
    const trimmed = rawAddress.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed === "object" && parsed !== null
        ? parsed
        : { street: trimmed };
    } catch {
      return { street: trimmed };
    }
  }
  return null;
};

// POST /api/maintenance
export const createMaintenance = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      address,
      serviceAddress,
      batteryCategory,
      batteryBrand,
      batteryModel,
      problemDescription,
      issue,
      description,
      preferredVisitTime,
    } = req.body;

    const parsedAddress = parseAddressField(address || serviceAddress);
    const finalProblem = (
      problemDescription ||
      issue ||
      description ||
      ""
    ).trim();

    if (
      !customerName?.trim() ||
      !customerMobile?.trim() ||
      !parsedAddress ||
      !batteryCategory?.trim() ||
      !finalProblem
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, mobile, address, battery category, and problem description are required.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      if (req.file.path) {
        imageUrl = req.file.path;
      } else if (req.file.buffer) {
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    }

    const maintenance = await Maintenance.create({
      user: req.user?._id || null,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      address: parsedAddress,
      batteryCategory: batteryCategory.trim(),
      batteryBrand: batteryBrand?.trim() || "",
      batteryModel: batteryModel?.trim() || "",
      problemDescription: finalProblem,
      preferredVisitTime: preferredVisitTime?.trim() || "",
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request submitted successfully",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/maintenance/my-requests
export const getMyMaintenanceRequests = async (req, res, next) => {
  try {
    const conditions = [{ user: req.user._id }];

    if (req.user.mobile) {
      const digits = String(req.user.mobile).replace(/\D/g, "").slice(-10);
      if (digits.length === 10) {
        conditions.push({ customerMobile: new RegExp(`${digits}$`) });
      }
    }

    const requests = await Maintenance.find({ $or: conditions })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/maintenance (Admin)
export const getAllMaintenanceRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const requests = await Maintenance.find(filter)
      .populate("user", "name email mobile address")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/maintenance/:id (Admin)
export const updateMaintenanceRequest = async (req, res, next) => {
  try {
    const {
      status,
      assignedTechnician,
      scheduledDate,
      technicianRemarks,
      serviceCharge,
    } = req.body;

    const updated = await Maintenance.findByIdAndUpdate(
      req.params.id,
      {
        ...(status !== undefined && { status }),
        ...(assignedTechnician !== undefined && {
          assignedTechnician: assignedTechnician.trim(),
        }),
        ...(scheduledDate !== undefined && {
          scheduledDate: scheduledDate || null,
        }),
        ...(technicianRemarks !== undefined && {
          technicianRemarks: technicianRemarks.trim(),
        }),
        ...(serviceCharge !== undefined && {
          serviceCharge: Number(serviceCharge) || 0,
        }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/maintenance/:id (Admin)
export const deleteMaintenanceRequest = async (req, res, next) => {
  try {
    const deleted = await Maintenance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted",
    });
  } catch (error) {
    next(error);
  }
};