const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Using DB:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // process.exit(1); ← keep this commented for now
  }
};

module.exports = connectDB;