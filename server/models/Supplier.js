import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        sku: { type: String, trim: true },
        wholesalePrice: { type: Number, min: 0 },
        available: { type: Boolean, default: true },
        leadTime: { type: String, trim: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

supplierSchema.index({ name: 1 });
supplierSchema.index({ "products.sku": 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
