const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user.id,
      items: req.body.items,
      total: req.body.total
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder };