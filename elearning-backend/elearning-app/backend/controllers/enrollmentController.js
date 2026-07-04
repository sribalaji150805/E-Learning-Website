// controllers/enrollmentController.js

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// POST /api/enrollments/:courseId -> enroll the logged-in student in a course
const enroll = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      completedLessons: []
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enrollments/:courseId -> get the logged-in student's enrollment/progress for one course
const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enrollments -> get ALL enrollments (with progress) for the logged-in student
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course"); // includes full course + lessons info

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/enrollments/:courseId/lessons/:lessonId -> toggle a lesson's completed status
const toggleLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    const alreadyDone = enrollment.completedLessons.some((id) => id.toString() === lessonId);

    if (alreadyDone) {
      // un-mark it (toggle off)
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId
      );
    } else {
      enrollment.completedLessons.push(lessonId);
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/enrollments/:courseId/quiz -> submit final test answers, calculate score
const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // expected: { questionId: selectedOptionIndex, ... }

    const enrollment = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.quiz || course.quiz.length === 0) {
      return res.status(400).json({ message: "This course has no final test" });
    }

    // Require all lessons to be completed before allowing the test
    const totalLessons = course.lessons.length;
    if (totalLessons > 0 && enrollment.completedLessons.length < totalLessons) {
      return res.status(400).json({ message: "Please complete all lessons before taking the test" });
    }

    // Compare submitted answers against the real correct answers (only the server knows these)
    let correctCount = 0;
    course.quiz.forEach((q) => {
      const submitted = answers[q._id.toString()];
      if (submitted !== undefined && Number(submitted) === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / course.quiz.length) * 100);
    const passed = scorePercent >= 80; // pass mark: 80%

    enrollment.quizScore = scorePercent;
    enrollment.quizAttempts += 1;
    enrollment.quizPassed = passed;
    enrollment.certificateIssued = passed; // certificate eligibility = passing the test
    await enrollment.save();

    res.json({
      score: scorePercent,
      correctCount,
      totalQuestions: course.quiz.length,
      passed,
      passPercentage: 80,
      certificateIssued: passed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enroll, getEnrollment, getMyEnrollments, toggleLessonComplete, submitQuiz };
