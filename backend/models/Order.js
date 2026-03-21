const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  customerName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: String,

  shippingAddress: {
    address: String,
    city: String,
    state: String,
    postalCode: String
  },

  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  paymentMethod: {
    type: String,
    enum: ["Razorpay", "UPI", "COD", "Stripe"],
    required: true
  },

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  orderStatus: {
    type: String,
    default: "Processing"
  },

  totalPrice: {
    type: Number,
    required: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);