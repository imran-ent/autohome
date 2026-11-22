import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerMobile: {
      type: String,
      required: [true, "Customer mobile number is required"],
      trim: true,
    },
    address: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Service address is required"],
    },
    batteryCategory: {
      type: String,
      required: [true, "Battery category is required"],
      trim: true,
    },
    batteryBrand: {
      type: String,
      default: "",
      trim: true,
    },
    batteryModel: {
      type: String,
      default: "",
      trim: true,
    },
    problemDescription: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    preferredVisitTime: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
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
      default: "",
      trim: true,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    technicianRemarks: {
      type: String,
      default: "",
      trim: true,
    },
    serviceCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

maintenanceSchema.pre("save", function (next) {
  if (!this.requestId) {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    this.requestId = `MNT-${randomPart}`;
  }
  next();
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;