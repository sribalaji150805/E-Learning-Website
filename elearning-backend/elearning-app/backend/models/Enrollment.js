// models/Enrollment.js
// Tracks a student's enrollment in a course, lesson progress, quiz result, and certificate status

const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // ids of completed lesson sub-documents

    quizScore: { type: Number, default: null },      // percentage score, e.g. 85
    quizAttempts: { type: Number, default: 0 },
    quizPassed: { type: Boolean, default: false },    // true if score >= 80%
    certificateIssued: { type: Boolean, default: false },
    paymentId: { type: String, default: null }        // Razorpay payment ID for paid courses
  },
  { timestamps: true }
);

// Prevent the same student from having two enrollment records for the same course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
