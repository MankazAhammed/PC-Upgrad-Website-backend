const mongoose = require("mongoose");

const buildSchema = new mongoose.Schema(
  {
    cpu: String,
    motherboard: String,
    gpu: String,
    ram: String,
    psu: String,
    storage: String,
    cooler: String,
    case: String,
    price: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Build", buildSchema);
