// models/Course.js
// Blueprint for a "Course" document

const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String }, // link to a video (e.g. YouTube embed link)
  content: { type: String }   // text content / notes for the lesson
});

// One quiz question: a question text, 4 options, and the index (0-3) of the correct option
const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true }, // exactly 4 options expected
  correctAnswer: { type: Number, required: true } // index 0-3
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    price: { type: Number, default: 0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [lessonSchema], // a course has many lessons, embedded directly
    quiz: [quizQuestionSchema], // final test for the course (optional)
    thumbnail: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
