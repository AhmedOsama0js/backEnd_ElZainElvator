const mongoose = require("mongoose");
mongoose.models.Product && delete mongoose.models.Product;

const productSchema = new mongoose.Schema(
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

    // category: {
    //   type: String,
    //   required: true,
    //   enum: [
    //     "أسلاك",
    //     "مفاتيح",
    //     "لمبات",
    //     "خراطيم",
    //     "لوحات",
    //     "إكسسوارات",
    //     "أخرى",
    //   ],
    // },

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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
