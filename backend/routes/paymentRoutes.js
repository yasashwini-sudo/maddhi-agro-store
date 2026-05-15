const express = require("express");
const router = express.Router();

const {
  initiatePayment
} = require("../controllers/paymentController");

router.post("/initiate", initiatePayment);

module.exports = router;