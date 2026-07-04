// controllers/courseController.js

const Course = require("../models/Course");
const User = require("../models/User");

// GET /api/courses  -> list all courses (public)
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id -> get single course details (quiz answers hidden from this response)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Convert to plain object so we can safely strip correctAnswer before sending to the client
    const courseObj = course.toObject();
    courseObj.quiz = (courseObj.quiz || []).map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));
    courseObj.hasQuiz = (course.quiz || []).length > 0;

    res.json(courseObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses -> create a course (instructor only)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, lessons, quiz, thumbnail } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      price,
      lessons,
      quiz,
      thumbnail,
      instructor: req.user.id // comes from the logged-in user's token
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id/quiz -> get quiz questions WITHOUT revealing correct answers (for students taking the test)
const getCourseQuiz = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const safeQuiz = (course.quiz || []).map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options
      // correctAnswer intentionally omitted
    }));

    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, getCourseQuiz };
