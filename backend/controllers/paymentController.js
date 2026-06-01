const axios = require("axios");
const crypto = require("crypto");
const qs = require("querystring");

exports.initiatePayment = async (req, res) => {

  console.log("🚀 PAYMENT API HIT");

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
      o: orderId,
      ta: String(amount),
      c: "INR",
      mac: macToken,
      murl: merchantUrl,
      name: customerName,
      phone: customerPhone,
      emailId: customerEmail,
      ha: hash,
    };

    // ================================
    // TOUCAN API URL
    // ================================
    const toucanUrl = `${baseUrl}/api/auth/getpaymentsession`;

    console.log("📡 CALLING TOUCAN API");

    // ================================
    // DEBUG LOGS
    // ================================
    console.log("TOUCAN URL:", toucanUrl);
    console.log("BASE URL:", baseUrl);
    console.log("MID:", merchantNumber);
    console.log("TID:", terminalId);
    console.log("PAYLOAD:", payload);

    // ================================
    // TOUCAN API CALL
    // ================================


    const formData = qs.stringify(payload);

console.log("FORM DATA:", formData);

const response = await axios.post(
  toucanUrl,
  formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        maxRedirects: 0,

        timeout: 30000,

        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
      }
    );

    console.log("✅ TOUCAN RESPONSE RECEIVED");

    // ================================
    // REDIRECT URL
    // ================================
    const redirectUrl = response.headers.location;

    console.log("🔗 REDIRECT URL GENERATED");

    // ================================
    // SEND SUCCESS RESPONSE
    // ================================
    return res.json({
      success: true,
      redirectUrl,
    });

  } catch (error) {

    console.error("❌ PAYMENT ERROR:", error.message);
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("HEADERS:", error.response?.headers);

    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
  }
};