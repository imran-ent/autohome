import { Router } from "express";
import Technician from "../models/Technician.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Get all technicians (On-duty first)
router.get("/", protect, requireAdmin, async (req, res, next) => {
  try {
    const technicians = await Technician.find()
      .sort({ isAvailable: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (error) {
    next(error);
  }
});

// Add technician
router.post("/", protect, requireAdmin, async (req, res, next) => {
  try {
    const { name, phone, specialty, area, isAvailable, notes } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Technician name and phone number are required",
      });
    }

    const technician = await Technician.create({
      name: name.trim(),
      phone: phone.trim(),
      specialty: specialty?.trim() || "Inverter & Battery Service",
      area: area?.trim() || "Pernambut & Surroundings",
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      notes: notes?.trim() || "",
    });

    res.status(201).json({
      success: true,
      data: technician,
    });
  } catch (error) {
    next(error);
  }
});

// Update technician
router.put("/:id", protect, requireAdmin, async (req, res, next) => {
  try {
    const { name, phone, specialty, area, isAvailable, notes } = req.body;

    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(specialty !== undefined && { specialty: specialty.trim() }),
        ...(area !== undefined && { area: area.trim() }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(notes !== undefined && { notes: notes.trim() }),
      },
      { new: true, runValidators: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    res.status(200).json({
      success: true,
      data: technician,
    });
  } catch (error) {
    next(error);
  }
});

// Delete technician
router.delete("/:id", protect, requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Technician.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Technician removed",
    });
  } catch (error) {
    next(error);
  }
});

export default router;