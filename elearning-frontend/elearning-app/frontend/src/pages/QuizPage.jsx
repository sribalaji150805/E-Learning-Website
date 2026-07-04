// src/pages/QuizPage.jsx
// The final test a student takes after completing all lessons in a course

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function QuizPage() {
  const { id } = useParams(); // course id
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // set after submitting

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);
        setQuestions(courseRes.data.quiz || []);
      } catch {
        setError("Could not load the test. Make sure you're enrolled and have completed all lessons.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      const res = await api.post(`/enrollments/${id}/quiz`, { answers });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit the test");
    }
  };

  if (loading) return <p className="status">Loading test...</p>;
  if (error && questions.length === 0) return <p className="status error">{error}</p>;

  // ----- Result screen, shown after submission -----
  if (result) {
    return (
      <div className="container form-container">
        <div className={`result-card ${result.passed ? "result-pass" : "result-fail"}`}>
          <h2>{result.passed ? "🎉 You Passed!" : "Not Quite There Yet"}</h2>
          <p className="result-score">{result.score}%</p>
          <p>{result.correctCount} out of {result.totalQuestions} correct</p>
          <p>Pass mark: {result.passPercentage}%</p>

          {result.passed ? (
            <>
              <p>You're eligible for a certificate of completion. 🎓</p>
              <Link to={`/courses/${id}/certificate`} className="btn-solid">View / Download Certificate</Link>
            </>
          ) : (
            <p>You need at least {result.passPercentage}% to earn the certificate. Review the lessons and try again!</p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button onClick={() => navigate(`/courses/${id}`)} className="btn-outline">Back to Course</button>
            {!result.passed && (
              <button onClick={() => { setResult(null); setAnswers({}); }} className="btn-outline" style={{ marginLeft: "0.6rem" }}>
                Retake Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----- Quiz form -----
  return (
    <div className="container form-container" style={{ maxWidth: "650px" }}>
      <h2>Final Test: {course?.title}</h2>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Answer all questions below. You need {80}% or higher to pass and earn your certificate.
      </p>

      <form onSubmit={handleSubmit} className="form">
        {questions.map((q, index) => (
          <div key={q._id} className="quiz-question-card">
            <p className="quiz-question-text">{index + 1}. {q.question}</p>
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="quiz-option">
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === optIndex}
                  onChange={() => selectAnswer(q._id, optIndex)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-solid">Submit Test</button>
      </form>
    </div>
  );
}
