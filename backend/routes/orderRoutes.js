const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// CREATE ORDER (protected)
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user);
    const newOrder = new Order({
      ...req.body,
      user: req.user.id // 🔥 IMPORTANT
    });

    await newOrder.save();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

    await newOrder.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// GET ALL ORDERS (optional: protect if needed)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;