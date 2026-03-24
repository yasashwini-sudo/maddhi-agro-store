const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json([]);
  }
});

router.delete("/all", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;