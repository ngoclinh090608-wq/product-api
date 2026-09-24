const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: [true, "pid là bắt buộc"],
      unique: true,
      trim: true,
    },

    pname: {
      type: String,
      required: [true, "pname là bắt buộc"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "price là bắt buộc"],
      min: [0, "price không được nhỏ hơn 0"],
    },

    quantity: {
      type: Number,
      required: [true, "quantity là bắt buộc"],
      min: [0, "quantity không được nhỏ hơn 0"],
      validate: {
        validator: Number.isInteger,
        message: "quantity phải là số nguyên",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", productSchema);