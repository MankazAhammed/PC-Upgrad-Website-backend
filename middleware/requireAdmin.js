// middleware/requireAdmin.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/**
 * Require an admin JWT in Authorization: Bearer <token>
 * Sets req.user on success.
 */
module.exports = function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: admin only" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
