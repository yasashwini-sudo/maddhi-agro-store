require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();


// ===============================
// MIDDLEWARES
// ===============================

// ✅ CORS (SAFE + FLEXIBLE)
app.use(cors({
  origin: "*", // you can restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===============================
// STATIC FILES
// ===============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ===============================
// ROUTES
// ===============================
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", authRoutes);


// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({ msg: "Something went wrong" });
});


// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('🚀 Server running on port ${PORT}');
    });

  } catch (error) {
    console.error("Server start failed:", error);
    process.exit(1);
  }
};

startServer();