const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const auth = require("../middleware/auth");


// ===============================
// CREATE ORDER (PROTECTED)
// ===============================
router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user);

    const newOrder = new Order({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      items: req.body.items || [],
      total: req.body.total || 0,
      date: req.body.date || new Date(),
      user: req.user.id // ✅ attach order to logged-in user
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: newOrder
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      msg: "Failed to create order"
    });
  }
});

// ===============================
// ADMIN - GET ALL ORDERS
// ===============================
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("ADMIN ORDER ERROR:", err);
    res.status(500).json([]);
  }
});


// ===============================
// GET USER ORDERS (FIXED 🔥)
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    console.log("FETCHING ORDERS FOR:", req.user.id);

    const orders = await Order.find({
      user: req.user.id   // ✅ ONLY this user's orders
    }).sort({ createdAt: -1 });

    console.log("ORDERS FOUND:", orders.length);

    res.json(orders);

  } catch (err) {
    console.error("FETCH ORDER ERROR:", err);
    res.status(500).json({
      msg: "Failed to fetch orders"
    });
  }
});


module.exports = router;