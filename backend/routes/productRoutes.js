const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

const upload = require("../config/upload");


// 🔥 CREATE PRODUCT
router.post("/", upload.single("image"), createProduct);


// 🔥 GET ALL PRODUCTS
router.get("/", getProducts);


// 🔥 SEARCH PRODUCTS (keep this BEFORE /:id to avoid conflicts)
router.get("/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" }
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔥 DELETE ALL PRODUCTS (IMPORTANT: BEFORE /:id)
router.delete("/all", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 DELETE ONE PRODUCT
router.delete("/:id", deleteProduct);


// 🔥 UPDATE PRODUCT
router.put("/:id", updateProduct);


// 🔥 BULK INSERT PRODUCTS
router.post("/bulk", async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;