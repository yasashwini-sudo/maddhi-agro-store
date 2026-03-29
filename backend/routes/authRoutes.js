const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ===============================
// SIGNUP
// ===============================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ msg: "Signup successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;