// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// --- Config ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pc-upgrade-guide";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

// --- Middleware ---
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: false,
  })
);
app.use(express.json());

// --- DB Connect ---
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected:", MONGODB_URI))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Routes ---
app.get("/health", (req, res) => res.json({ ok: true }));

// Auth route (expects a routes/auth.js file; see note below)
try {
  app.use("/api/auth", require("./routes/auth"));
} catch (e) {
  console.warn(
    "routes/auth.js not found. Admin login will not work until you add it."
  );
}

// Builds routes
app.use("/api/builds", require("./routes/builds"));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
