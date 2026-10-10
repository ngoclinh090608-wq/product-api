const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  pid: {
    type: String,
    required: [false, 'Product pid is required.'],
    unique: true,
    trim: true
  },
  pname: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
    min: [0, 'Price must be greater than or equal to 0.']
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required.'],
    min: [0, 'Quantity must be greater than or equal to 0.'],
    validate: {
      validator: function (v) {
        return Number.isInteger(v); // Custom validator
      },
      message: 'Quantity must be an integer.'
    }
  }
}, { timestamps: true, versionKey: false });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
