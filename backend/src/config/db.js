const dns = require("dns");
const mongoose = require("mongoose");

// Fix for Windows/ISP DNS failing to resolve MongoDB Atlas SRV records (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Fall back to default system DNS if setServers is unavailable
}

let isConnecting = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[Database] MONGO_URI is not set in backend/.env");
    return false;
  }
  if (isConnecting || mongoose.connection.readyState === 1) return true;

  try {
    isConnecting = true;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnecting = false;
    console.log(`[Database] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return true;
  } catch (err) {
    isConnecting = false;
    console.error(`[Database] Connection failed: ${err.message}`);
    console.log("👉 Please verify your connection string and ensure IP 0.0.0.0/0 is added to Atlas Network Access.");
    return false;
  }
}

module.exports = connectDB;
