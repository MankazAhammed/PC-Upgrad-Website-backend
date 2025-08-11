const express = require("express");
const router = express.Router();
const Build = require("../models/Build");

// Save a new build
router.post("/save", async (req, res) => {
  try {
    const build = new Build(req.body);
    await build.save();
    res.status(201).json({ success: true, message: "Build saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save build" });
  }
});

// Get all builds
router.get("/all", async (req, res) => {
  try {
    const builds = await Build.find().sort({ createdAt: -1 });
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch builds" });
  }
});

// Delete a build by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await Build.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Build not found" });
    }
    res.json({ success: true, message: "Build deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete build" });
  }
});

module.exports = router;
