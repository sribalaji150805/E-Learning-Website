// routes/paymentRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", protect, createOrder); // create Razorpay order (student must be logged in)
router.post("/verify", protect, verifyPayment);     // verify payment + enroll student

module.exports = router;
