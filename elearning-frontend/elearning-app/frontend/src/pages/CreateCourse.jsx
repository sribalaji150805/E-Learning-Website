// src/pages/CreateCourse.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correctAnswer: 0 });

export default function CreateCourse() {
  const [form, setForm] = useState({ title: "", description: "", category: "", price: 0 });
  const [lessons, setLessons] = useState([{ title: "", content: "", videoUrl: "" }]);
  const [quiz, setQuiz] = useState([emptyQuestion()]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----- Lessons -----
  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };
  const addLesson = () => setLessons([...lessons, { title: "", content: "", videoUrl: "" }]);
  const removeLesson = (index) => setLessons(lessons.filter((_, i) => i !== index));

  // ----- Quiz -----
  const handleQuestionChange = (qIndex, value) => {
    const updated = [...quiz];
    updated[qIndex].question = value;
    setQuiz(updated);
  };
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quiz];
    updated[qIndex].options[optIndex] = value;
    setQuiz(updated);
  };
  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const updated = [...quiz];
    updated[qIndex].correctAnswer = optIndex;
    setQuiz(updated);
  };
  const addQuestion = () => setQuiz([...quiz, emptyQuestion()]);
  const removeQuestion = (index) => setQuiz(quiz.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Quiz is optional — only send questions that have actual text filled in
    const validQuiz = quiz.filter((q) => q.question.trim() && q.options.every((o) => o.trim()));

    try {
      const res = await api.post("/courses", { ...form, lessons, quiz: validQuiz });
      navigate(`/courses/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create course");
    }
  };

  return (
    <div className="container form-container" style={{ maxWidth: "650px" }}>
      <h2>Create a New Course</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="title" placeholder="Course Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="category" placeholder="Category (e.g. Programming)" value={form.category} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price (0 for free)" value={form.price} onChange={handleChange} />

        <h3>Lessons</h3>
        {lessons.map((lesson, index) => (
          <div key={index} className="lesson-input-group">
            <input
              placeholder={`Lesson ${index + 1} Title`}
              value={lesson.title}
              onChange={(e) => handleLessonChange(index, "title", e.target.value)}
              required
            />
            <textarea
              placeholder="Lesson content / notes (write detailed notes — this is what the student reads)"
              value={lesson.content}
              onChange={(e) => handleLessonChange(index, "content", e.target.value)}
              rows={4}
            />
            <input
              placeholder="YouTube Video URL (optional, e.g. https://www.youtube.com/watch?v=...)"
              value={lesson.videoUrl}
              onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)}
            />
            {lessons.length > 1 && (
              <button type="button" onClick={() => removeLesson(index)} className="btn-outline small">
                Remove Lesson
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addLesson} className="btn-outline">+ Add Another Lesson</button>

        <h3 style={{ marginTop: "1rem" }}>Final Test (Quiz)</h3>
        <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "-0.5rem" }}>
          Students must score 80% or higher on this test (after completing all lessons) to earn a certificate.
          Leave blank if you don't want a test for this course.
        </p>

        {quiz.map((q, qIndex) => (
          <div key={qIndex} className="lesson-input-group">
            <input
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="quiz-option">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === optIndex}
                  onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                />
                <input
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  style={{ flex: 1, marginLeft: "0.5rem" }}
                />
              </label>
            ))}
            <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Select the radio button next to the correct option.</p>
            {quiz.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qIndex)} className="btn-outline small">
                Remove Question
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="btn-outline">+ Add Another Question</button>

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-solid">Publish Course</button>
      </form>
    </div>
  );
}
