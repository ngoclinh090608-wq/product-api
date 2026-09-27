const Product = require('../models/product');

// GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ pid: 1 });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:pid
exports.getProductByPid = async (req, res, next) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.pid} not found.` });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    const product = await Product.create({ pid, pname, price, quantity });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:pid
exports.updateProduct = async (req, res, next) => {
  try {
    const { pname, price, quantity } = req.body; // pid is not editable
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { pname, price, quantity },
      { returnDocument: 'after', runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.pid} not found.` });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:pid
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.pid} not found.` });
    }
    res.status(200).json({ message: `Product ${req.params.pid} deleted.` });
  } catch (err) {
    next(err);
  }
};