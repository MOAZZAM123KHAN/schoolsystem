require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const seedInitialData = require("./seed");

const authRoutes = require("./routes/auth");
const settingsRoutes = require("./routes/settings");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Allow up to 15MB payloads for base64 photo and logo uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Serverless / background connection helper
let dbInitPromise = null;
async function ensureDb() {
  if (mongoose.connection.readyState === 1) return true;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        const connected = await connectDB();
        if (connected) {
          await seedInitialData();
          return true;
        }
      } catch (err) {
        console.error("[Database] ensureDb error:", err.message);
      } finally {
        if (mongoose.connection.readyState !== 1) {
          dbInitPromise = null;
        }
      }
      return false;
    })();
  }
  return dbInitPromise;
}

// Health check endpoint (always accessible)
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    ok: true,
    database: dbConnected ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

// Middleware: Check database availability for API routes
app.use("/api", async (req, res, next) => {
  if (req.path === "/health") return next();

  if (mongoose.connection.readyState !== 1) {
    await ensureDb();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database is not connected. Please ensure MongoDB is running or set a valid MONGO_URI in your environment variables (such as MongoDB Atlas).",
    });
  }
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/students", studentRoutes);

// In production (when run standalone), serve the built React app from the same server
const distDir = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(distDir));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"), (err) => {
    if (err && !res.headersSent) {
      res.status(200).send("Report Card Maker API is running. Build the frontend with 'npm run build' to view the UI.");
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  const status = err.name === "ValidationError" || err.name === "CastError" ? 400 : err.status || 500;
  res.status(status).json({ message: err.message || "An unexpected error occurred." });
});

    // Only listen on port if running locally (not inside Vercel serverless environment)
    if (!process.env.VERCEL) {
      app.listen(PORT, async () => {
        console.log(`Backend API running on http://localhost:${PORT}`);

      const connected = await connectDB();
      if (connected) {
        await seedInitialData();
      } else {
        // Retry every 10 seconds in the background
        const timer = setInterval(async () => {
          const ok = await connectDB();
          if (ok) {
            clearInterval(timer);
            await seedInitialData();
          }
        }, 10000);
      }
    });
}

module.exports = app;
