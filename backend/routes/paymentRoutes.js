const express = require("express");
const router = express.Router();

const {
  initiatePayment
} = require("../controllers/paymentController");

router.post("/initiate", initiatePayment);

// NEW SUCCESS CALLBACK
router.post("/success", (req, res) => {
  console.log("TOUCAN SUCCESS CALLBACK");
  console.log(req.body);

  return res.redirect(
    "https://maddhiagrofoodindia.com/payment-success.html"
  );
});

// NEW FAILURE CALLBACK
router.post("/failure", (req, res) => {
  console.log("TOUCAN FAILURE CALLBACK");
  console.log(req.body);

  return res.redirect(
    "https://maddhiagrofoodindia.com/payment-failed.html"
  );
});

module.exports = router;