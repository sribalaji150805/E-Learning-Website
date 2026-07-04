// controllers/paymentController.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payments/create-order
const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.price === 0) {
      return res.status(400).json({ message: "This course is free. No payment needed." });
    }

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Receipt must be max 40 chars — use only last 8 chars of each ID
    const receipt = `r_${req.user.id.toString().slice(-8)}_${courseId.toString().slice(-8)}`;

    const options = {
      amount: course.price * 100, // paise
      currency: "INR",
      receipt: receipt,
      notes: {
        courseId: courseId.toString(),
        studentId: req.user.id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.title,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ message: error?.error?.description || error.message });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!existing) {
      await Enrollment.create({
        student: req.user.id,
        course: courseId,
        completedLessons: [],
        paymentId: razorpay_payment_id
      });
    }

    res.json({ success: true, message: "Payment successful! You are now enrolled.", paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
