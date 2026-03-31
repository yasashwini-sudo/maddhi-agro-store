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
      user: req.user.id,  
      status: "Pending" // ✅ default  
    });  

    await newOrder.save();  

    res.status(201).json({ success: true, order: newOrder });  

  } catch (err) {  
    console.error("ORDER ERROR:", err);  
    res.status(500).json({ success: false, msg: "Order failed" });  
  }  
});  


// ===============================  
// GET USER ORDERS  
// ===============================  
router.get("/", auth, async (req, res) => {  
  try {  
    const orders = await Order.find({ user: req.user.id }).sort({ _id: -1 });  
    res.json(orders);  
  } catch (err) {  
    console.error("FETCH ORDER ERROR:", err);  
    res.status(500).json({ msg: "Failed to fetch user orders" });  
  }  
});  


// ===============================  
// 🔥 ADMIN - GET ALL ORDERS  
// ===============================  
router.get("/admin/all", async (req, res) => {  
  try {  
    const orders = await Order.find().sort({ _id: -1 });  
    res.json(orders);  
  } catch (err) {  
    console.error("ADMIN FETCH ERROR:", err);  
    res.status(500).json({ msg: "Failed to fetch orders" });  
  }  
});  


// ===============================  
// 🔥 ADMIN - UPDATE STATUS  
// ===============================  
router.put("/admin/update/:id", async (req, res) => {  
  try {  
    const { status } = req.body;  

    if (!status) {  
      return res.status(400).json({ msg: "Status required" });  
    }  

    const order = await Order.findByIdAndUpdate(  
      req.params.id,  
      { status },  
      { new: true }  
    );  

    if (!order) {  
      return res.status(404).json({ msg: "Order not found" });  
    }  

    console.log("UPDATED ORDER:", order); // 🔥 debug

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
    const deleted = await Order.findByIdAndDelete(req.params.id);  

    if (!deleted) {  
      return res.status(404).json({ msg: "Order not found" });  
    }  

    res.json({ success: true });  

  } catch (err) {  
    console.error("DELETE ERROR:", err);  
    res.status(500).json({ msg: "Failed to delete order" });  
  }  
});  


module.exports = router;