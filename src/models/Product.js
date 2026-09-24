const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
    pid: {
    type: Number,
    required: true,
    unique: true
    },

    pname: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      max: 9999999999.99,
      validate: {
        validator: (value) =>
          Number.isFinite(value) &&
          Number(value.toFixed(2)) === value,
        message: "price chỉ được tối đa 2 chữ số thập phân",
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
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