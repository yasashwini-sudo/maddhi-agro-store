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
      items: req.body.items,
      total: req.body.total,
      date: req.body.date,
      user: req.user.id // ✅ correct
    });

    await newOrder.save();

    res.json({ success: true });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ success: false });
  }
});


// ===============================
// GET USER ORDERS
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user.id },   // new orders
        { user: { $exists: false } } // old orders
      ]
    });
    res.json(orders);
  } catch (err) {
    console.error("FETCH ORDER ERROR:", err);
    res.status(500).json([]);
  }
});

module.exports = router;