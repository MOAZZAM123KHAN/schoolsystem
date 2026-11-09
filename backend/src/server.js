require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
app.use("/api/students", studentRoutes);

// In production, serve the built React app from the same server
const distDir = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(distDir));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.name === "ValidationError" ? 400 : 500).json({ message: err.message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

