const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const hashed = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password: hashed
      });
  
      res.json({ message: "User created" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};