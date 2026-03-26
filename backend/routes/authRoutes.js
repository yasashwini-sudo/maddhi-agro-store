const express = require("express");
const router = express.Router();

// Controllers
const { register, login } = require("../controllers/authController");

// ===============================
// AUTH ROUTES
// ===============================

// 🔥 REGISTER USER
router.post("/register", register);

// 🔥 LOGIN USER
router.post("/login", login);

module.exports = router;