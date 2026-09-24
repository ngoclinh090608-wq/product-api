const express = require("express");

const {
  createProduct,
  getProducts,
  getProductByPid,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/")
  .post(createProduct)
  .get(getProducts);

router.route("/:pid")
  .get(getProductByPid)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;