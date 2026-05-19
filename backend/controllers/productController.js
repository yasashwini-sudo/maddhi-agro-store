const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {

    // ✅ handle structured description safely
    let description = req.body.description;
    if (typeof description === "string") {
      try {
        description = JSON.parse(description);
      } catch (e) {
        // keep as is if not JSON
      }
    }

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: description,
      category: req.body.category,

stock: req.body.stock || 0,

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
    const db = require("mongoose").connection.db;

    // 🔥 RAW MongoDB query (bypasses schema completely)
    const rawProducts = await db.collection("products").find().toArray();

    console.log("RAW DB PRODUCTS:", rawProducts);

    res.json(rawProducts);
  } catch (error) {
    console.error(error);
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

    // ✅ same fix for update
    let description = req.body.description;
    if (typeof description === "string") {
      try {
        description = JSON.parse(description);
      } catch (e) {}
    }

    const updatedData = {
      ...req.body,
    
      stock: req.body.stock || 0,
    
      description: description
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};