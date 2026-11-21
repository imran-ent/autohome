import "dotenv/config";
import http from "http";
import https from "https";
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

// Trust Render's reverse proxy so rate-limiters read real client IPs accurately
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS (supports main domain, www subdomain, local dev, and server-to-server health monitors)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://autohomebatteries.in",
  "https://www.autohomebatteries.in",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check (placed before rate limiters so uptime pingers never get blocked)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "AutoHome Batteries API is running",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

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

// Keep-alive self-pinger (pings Render's public URL every 10 minutes in production)
const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
if (process.env.NODE_ENV === "production" && externalUrl) {
  const healthUrl = `${externalUrl.replace(/\/$/, "")}/api/health`;
  const client = healthUrl.startsWith("https") ? https : http;
  const TEN_MINUTES = 10 * 60 * 1000;

  const pingInterval = setInterval(() => {
    client
      .get(healthUrl, (res) => {
        res.resume(); // Drain response stream to prevent memory leaks
      })
      .on("error", (err) => {
        console.error("Keep-alive ping failed:", err.message);
      });
  }, TEN_MINUTES);

  // Allow clean process exit during Render redeploys
  pingInterval.unref();
}

export default app;