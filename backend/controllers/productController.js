const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.file ? req.file.filename : null
    });

    const savedProduct = await newProduct.save();

    res.json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCTS
exports.getProducts = async (req, res) => {
  try {

    const category = req.query.category;

    let products;

    if (category) {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};