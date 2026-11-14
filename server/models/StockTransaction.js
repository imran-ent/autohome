import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["in", "out", "reserve", "release", "adjust"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    referenceType: {
      type: String,
      enum: ["order", "sale", "manual", "purchase"],
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

stockTransactionSchema.index({ product: 1, createdAt: -1 });
stockTransactionSchema.index({ type: 1 });
stockTransactionSchema.index({ referenceType: 1, referenceId: 1 });

const StockTransaction = mongoose.model("StockTransaction", stockTransactionSchema);

export default StockTransaction;
