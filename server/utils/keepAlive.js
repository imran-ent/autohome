// server/utils/keepAlive.js
import https from "https";

export const setupHealthAndKeepAlive = (app) => {
  // Lightweight health check endpoint (handles both GET and HEAD)
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "AutoHome Batteries API",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Self-ping every 10 minutes in production to prevent 15-min idle sleep
  const externalUrl = process.env.RENDER_EXTERNAL_URL;
  if (process.env.NODE_ENV === "production" && externalUrl) {
    const healthUrl = `${externalUrl.replace(/\/$/, "")}/api/health`;
    const TEN_MINUTES = 10 * 60 * 1000;

    setInterval(() => {
      https
        .get(healthUrl, (res) => {
          res.resume(); // Drain response to free memory
        })
        .on("error", (err) => {
          console.error("Keep-alive ping error:", err.message);
        });
    }, TEN_MINUTES);
  }
};