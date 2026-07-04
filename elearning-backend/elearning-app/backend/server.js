// server.js
// This is the MAIN entry point of our backend. Running "npm run dev" starts this file.

require("dotenv").config(); // loads variables from .env file into process.env
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ----- Middleware (functions that run on every request) -----
app.use(cors()); // allows our React frontend (different port) to talk to this backend
app.use(express.json()); // allows us to read JSON data sent in requests (req.body)

// ----- Connect to MongoDB -----
connectDB();

// ----- Test route -----
app.get("/", (req, res) => {
  res.send("E-Learning API is running...");
});

// ----- Routes (we will add these as we build features) -----
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
