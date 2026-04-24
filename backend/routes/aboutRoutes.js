const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const aboutData = await db
      .collection("about")
      .findOne({}, { projection: { _id: 0 } });

    res.json(aboutData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;   // ✅ THIS LINE IS CRITICAL