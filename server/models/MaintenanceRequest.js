import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerMobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    batteryCategory: {
      type: String,
      enum: [
        "Home Inverter Battery",
        "Bike Battery",
        "Car Battery",
        "Truck / Commercial Battery",
        "Other",
      ],
      required: true,
    },
    batteryBrand: { type: String, trim: true },
    batteryModel: { type: String, trim: true },
    purchaseDate: { type: Date },
    problemDescription: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    preferredVisitTime: {
      type: String,
      trim: true,
    },
    image: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "Requested",
        "Accepted",
        "Technician Assigned",
        "Scheduled",
        "Technician On the Way",
        "In Progress",
        "Resolved",
        "Cancelled",
      ],
      default: "Requested",
    },
    assignedTechnician: {
      type: String,
      trim: true,
    },
    scheduledDate: { type: Date },
    technicianRemarks: { type: String, trim: true },
    serviceCharge: { type: Number, default: 0, min: 0 },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ customer: 1, createdAt: -1 });
maintenanceSchema.index({ createdAt: -1 });

const MaintenanceRequest = mongoose.model("MaintenanceRequest", maintenanceSchema);

export default MaintenanceRequest;
