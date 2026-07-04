// routes/authRoutes.js
// Maps URLs (endpoints) to controller functions

const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/signup", signup); // POST http://localhost:5000/api/auth/signup
router.post("/login", login);   // POST http://localhost:5000/api/auth/login

module.exports = router;
