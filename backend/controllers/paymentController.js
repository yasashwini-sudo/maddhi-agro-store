const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");

exports.initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    // ================================
    // ENV VALUES
    // ================================
    const terminalId = process.env.TOUCAN_TERMINAL_ID;
    const merchantNumber = process.env.TOUCAN_MERCHANT_NUMBER;
    const macToken = process.env.TOUCAN_MAC_TOKEN;
    const baseUrl = process.env.TOUCAN_BASE_URL;
    const merchantUrl = process.env.TOUCAN_MERCHANT_URL;

    // ================================
    // ORDER ID
    // ================================
    const orderId = Date.now().toString();

    // ================================
    // HASH GENERATION
    // Toucan team confirmed:
    // SHA512 only with "ta"
    // ================================
    const hash = crypto
      .createHash("sha512")
      .update(String(amount))
      .digest("hex");

    // ================================
    // FINAL PAYLOAD
    // ================================
    const payload = {
      t: terminalId,
      m: merchantNumber,
      o: orderId,
      ta: String(amount),
      c: "INR",
      mac: macToken,
      ha: hash,
      murl: merchantUrl,
      surl: 'https://maddhiagrofoodindia.com/payment-success.html',
      furl: 'https://maddhiagrofoodindia.com/payment-failed.html',
      name: customerName,
      Phone: customerPhone,
      Emailid: customerEmail,
      
    };

    console.log("FINAL PAYLOAD:", payload);

    // ================================
    // TOUCAN API CALL
    // ================================
    const qs = require("querystring");

const response = await axios.post(
  `${baseUrl}/api/auth/getpaymentsession`,
  qs.stringify(payload),
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 0,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    },
  }
);

    // ================================
    // REDIRECT DIRECTLY TO PAYMENT PAGE
    // ================================
    const redirectUrl = response.headers.location;

    console.log("REDIRECT URL:", redirectUrl);

    return res.json({
      success: true,
      redirectUrl
    });

  } catch (error) {
    console.error(
      "PAYMENT ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};