// routes/courseRoutes.js

const express = require("express");
const router = express.Router();
const { getCourses, getCourseById, createCourse, getCourseQuiz } = require("../controllers/courseController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.get("/", getCourses);                 // anyone can view all courses
router.get("/:id", getCourseById);            // anyone can view one course
router.get("/:id/quiz", protect, getCourseQuiz); // logged-in students fetch quiz questions (no answers)

router.post("/", protect, allowRoles("instructor"), createCourse); // only logged-in instructors

module.exports = router;
