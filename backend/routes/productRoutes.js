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

// CREATE PRODUCT
router.post("/", upload.single("image"), createProduct);

// GET PRODUCTS
router.get("/", getProducts);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// SEARCH PRODUCTS
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

router.post("/bulk", async (req, res) => {
    try {
      const products = await Product.insertMany(req.body);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/delete-all", async (req, res) => {
    const Product = require("../models/Product");
  
    await Product.deleteMany({});
  
    res.json({ message: "All products deleted successfully" });
  });
  
  router.get("/", getProducts);
  
  router.post("/", upload.single("image"), createProduct);
  
  router.delete("/:id", deleteProduct);
  
  router.put("/:id", updateProduct);

module.exports = router;

