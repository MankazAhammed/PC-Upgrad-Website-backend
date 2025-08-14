// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "password123";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
