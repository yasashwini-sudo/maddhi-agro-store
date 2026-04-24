const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Using URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "maddhi-agro", // 🔥 CHANGE THIS
    });

    console.log("MongoDB Connected");
    console.log("Connected DB:", mongoose.connection.name);

    return mongoose.connection.db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;