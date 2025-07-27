const express = require("express");
const {createProduct, getProducts, getProduct} = require('../controllers/productController')

const router = express.Router();

//routes
router.post(
  "/", createProduct
);
//routes

//get products
router.get("/", getProducts);

//single product
router.get("/:id", getProduct);

module.exports = router;