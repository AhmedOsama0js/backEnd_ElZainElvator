const mongoose = require("mongoose");
mongoose.models.Store && delete mongoose.models.Store;

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["piece", "meter", "kg", "box", "liter"],
      default: "piece",
    },

    category: {
      type: String,
      enum: ["stage1", "stage2", "stage3"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
