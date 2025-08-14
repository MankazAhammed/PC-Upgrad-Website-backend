// routes/builds.js
const express = require("express");
const mongoose = require("mongoose");
const Build = require("../models/Build");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

/**
 * Save a new build
 * Body: { cpu, motherboard, gpu, ram, psu, storage, cooler, case/pcCase, price }
 */
router.post("/save", async (req, res) => {
  try {
    // Normalize "case" key (frontend sometimes sends pcCase)
    const payload = { ...req.body };
    if (!payload.case && payload.pcCase) payload.case = payload.pcCase;

    const build = new Build(payload);
    await build.save();
    return res
      .status(201)
      .json({ success: true, message: "Build saved", id: build._id });
  } catch (err) {
    console.error("Save error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to save build" });
  }
});

/**
 * Get all builds (newest first)
 */
router.get("/all", async (req, res) => {
  try {
    const builds = await Build.find().sort({ createdAt: -1 });
    return res.json(builds);
  } catch (err) {
    console.error("Fetch error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch builds" });
  }
});

/**
 * Delete a build by id (admin only)
 */
router.delete("/delete/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[DELETE] /api/builds/delete", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }

    const result = await Build.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, error: "Build not found" });
    }

    // Sanity check
    const stillThere = await Build.findById(id);
    console.log(" -> stillThere:", !!stillThere);

    return res.json({ success: true, message: "Build deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete build" });
  }
});

module.exports = router;
