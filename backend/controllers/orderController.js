// controllers/orderController.js

const createOrder = (req, res) => {
    const orderData = req.body;
  
    res.status(201).json({
      message: "Order created successfully",
      order: orderData
    });
  };
  
  module.exports = {
    createOrder
  };