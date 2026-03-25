// controllers/orderController.js

const createOrder = (req, res) => {
    const orderData = req.body;
  
    res.status(201).json({
      message: "Order created successfully",
      order: orderData
    });
  };

  const userId = req.user.id; // from token

const order = await Order.create({
  user: userId,
  items,
  total
});
  
  module.exports = {
    createOrder
  };