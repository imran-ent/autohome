import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import notFound from "./middleware/notFoundMiddleware.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many attempts, please try again later." },
});
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { success: false, message: "Too many AI requests, please try again later." },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "AutoHome Batteries API is running" });
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/admin/stock-transactions", inventoryRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/admin/maintenance", maintenanceRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/suppliers", supplierRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
