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
      user: req.user.id, // ✅ correct
      status: "Pending"  // 🔥 IMPORTANT DEFAULT
    });

    await newOrder.save();

    res.json({ success: true, order: newOrder });

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
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("FETCH ORDER ERROR:", err);
    res.status(500).json([]);
  }
});


// ===============================
// 🔥 ADMIN - GET ALL ORDERS
// ===============================
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json([]);
  }
});


// ===============================
// 🔥 ADMIN - UPDATE STATUS
// ===============================
router.put("/admin/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ msg: "Failed to update status" });
  }
});


// ===============================
// 🔥 ADMIN - DELETE ORDER
// ===============================
router.delete("/admin/delete/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Failed to delete order" });
  }
});


module.exports = router;