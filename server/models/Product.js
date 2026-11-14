import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: 100,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Home Inverter Batteries",
        "Bike Batteries",
        "Car Batteries",
        "Truck / Commercial Batteries",
        "Inverters",
        "Accessories",
      ],
    },
    subCategory: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    ahCapacity: {
      type: Number,
      required: [true, "Ah capacity is required"],
      min: 0,
    },
    voltage: {
      type: Number,
      required: [true, "Voltage is required"],
      min: 0,
    },
    batteryType: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    warranty: {
      type: String,
      required: [true, "Warranty is required"],
      trim: true,
      maxlength: 100,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: 0,
    },
    gstRate: {
      type: Number,
      default: 18,
      min: 0,
      max: 100,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    minStockLevel: {
      type: Number,
      default: 5,
      min: 0,
    },
    supplierAvailable: {
      type: Boolean,
      default: false,
    },
    supplierLeadTime: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    pros: [{ type: String, trim: true }],
    cons: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
    compatibleVehicles: [
      {
        make: String,
        model: String,
        yearFrom: Number,
        yearTo: Number,
      },
    ],
  },
  { timestamps: true }
);

// Virtual: available stock
productSchema.virtual("availableStock").get(function () {
  return Math.max(0, this.currentStock - this.reservedStock);
});

// Virtual: stock status
productSchema.virtual("stockStatus").get(function () {
  const available = this.availableStock;
  if (available <= 0) return "out_of_stock";
  if (available <= this.minStockLevel) return "low_stock";
  return "in_stock";
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
