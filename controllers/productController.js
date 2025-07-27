const Product = require("../models/product")
const Material = require('../models/material');
const Metal = require('../models/metal');
console.log("Hi")
const createProduct = async (req, res) => {
  try {
    const { name, materials } = req.body;
    //alidation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case (!materials || materials.length === 0):
        return res.status(400).send({ error: "Materials is Required" });
    }

    const products = new Product({ ...req.body });
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all products
const getProducts = async (req, res) => {
   try {
    const product = await Product
      .findById(req?.params?.id).populate('materials.materialid',"unit").populate('materials.metalid',"unitPrice");

    const material = product?.materials

    const priceCalculator = (data) => {
      return data
    }

    const price = priceCalculator(material)

      return res.status(200).json({
        data:{
          price:price
        }
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng  products",
      error,
    });
  }
};
// get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product
      .findById(req?.params?.id).populate('materials.materialid',"unitPrice discount").populate('materials.metalid',"unitPrice");

    const material = product?.materials

    const priceCalculator = (data) => {
      return data
    }

    const price = priceCalculator(material)

      return res.status(200).json({
        data:{
          price:price
        }
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getitng single product",
      error,
    });
  }
};

module.exports = ({
createProduct,
getProducts,
getProduct
})