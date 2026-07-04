// routes/enrollmentRoutes.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  enroll,
  getEnrollment,
  getMyEnrollments,
  toggleLessonComplete,
  submitQuiz
} = require("../controllers/enrollmentController");

router.get("/", protect, getMyEnrollments);                          // all my enrollments + progress
router.get("/:courseId", protect, getEnrollment);                    // my progress for one course
router.post("/:courseId", protect, enroll);                          // enroll in a course
router.put("/:courseId/lessons/:lessonId", protect, toggleLessonComplete); // mark/unmark lesson done
router.post("/:courseId/quiz", protect, submitQuiz);                 // submit final test answers

module.exports = router;
