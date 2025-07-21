const mongoose = require("mongoose");

const stageProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const projectSettingsSchema = new mongoose.Schema(
  {
    stage1: [stageProductSchema],
    stage2: [stageProductSchema],
    stage3: [stageProductSchema],
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", projectSettingsSchema);
module.exports = Settings;
