import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Technician name is required"],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20,
    },
    specialty: {
      type: String,
      default: "Inverter & Battery Service",
      trim: true,
    },
    area: {
      type: String,
      default: "Pernambut & Surroundings",
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;