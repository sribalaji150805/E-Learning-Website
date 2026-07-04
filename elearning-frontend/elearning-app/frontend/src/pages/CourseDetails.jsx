// src/pages/CourseDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function getEmbedUrl(url) {
  if (!url) return null;
  try {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("/embed/")) return url;
    return url;
  } catch { return url; }
}

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);
        if (user && user.role === "student") {
          try {
            const enrollRes = await api.get(`/enrollments/${id}`);
            setEnrollment(enrollRes.data);
          } catch { setEnrollment(null); }
        }
      } catch { setMessage("Could not load course"); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  // ---- FREE enrollment ----
  const handleFreeEnroll = async () => {
    if (!user) { setMessage("Please log in to enroll."); return; }
    try {
      const res = await api.post(`/enrollments/${id}`);
      setEnrollment(res.data);
      setMessage("✅ Enrolled! Start learning below.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    }
  };

  // ---- PAID enrollment via Razorpay ----
  const handlePaidEnroll = async () => {
    if (!user) { setMessage("Please log in to enroll."); return; }
    setPaying(true);
    setMessage("");

    try {
      // Step 1: create a Razorpay order on our backend
      const orderRes = await api.post("/payments/create-order", { courseId: id });
      const { orderId, amount, currency, courseName, keyId } = orderRes.data;

      // Step 2: open Razorpay checkout popup
      const options = {
        key: keyId,
        amount,
        currency,
        name: "EduLearn",
        description: courseName,
        order_id: orderId,
        handler: async function (response) {
          // Step 3: payment done — verify on backend + auto-enroll
          try {
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: id
            });

            if (verifyRes.data.success) {
              // Refresh enrollment state
              const enrollRes = await api.get(`/enrollments/${id}`);
              setEnrollment(enrollRes.data);
              setMessage("✅ Payment successful! You are now enrolled.");
            }
          } catch (err) {
            setMessage(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#4338ca" },
        modal: {
          ondismiss: () => {
            setMessage("Payment cancelled.");
            setPaying(false);
          }
        }
      };

      // Load Razorpay checkout script if not already loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not initiate payment");
    } finally {
      setPaying(false);
    }
  };

  const toggleComplete = async (lessonId) => {
    try {
      const res = await api.put(`/enrollments/${id}/lessons/${lessonId}`);
      setEnrollment(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update progress");
    }
  };

  if (loading) return <p className="status">Loading...</p>;
  if (!course) return <p className="status error">{message || "Course not found"}</p>;

  const lessons = course.lessons || [];
  const activeLesson = lessons[activeLessonIndex];
  const isEnrolled = !!enrollment;
  const isInstructorView = user?.role === "instructor";
  const isFree = course.price === 0;

  const completedCount = enrollment?.completedLessons?.length || 0;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isLessonDone = (lessonId) =>
    enrollment?.completedLessons?.some((cid) => cid === lessonId || cid.toString() === lessonId);

  return (
    <div className="container">
      <h1>{course.title}</h1>
      <p className="course-instructor">By {course.instructor?.name}</p>
      <p>{course.description}</p>
      <div className="course-meta" style={{ marginBottom: "1rem" }}>
        <span>{course.category}</span>
        <span className={isFree ? "price-free" : "price-paid"}>
          {isFree ? "Free" : `₹${course.price}`}
        </span>
      </div>

      {/* Enroll button — shown only to students who aren't yet enrolled */}
      {!isInstructorView && !isEnrolled && (
        isFree ? (
          <button onClick={handleFreeEnroll} className="btn-solid">
            Enroll for Free
          </button>
        ) : (
          <button onClick={handlePaidEnroll} className="btn-solid" disabled={paying}>
            {paying ? "Processing..." : `Buy Now — ₹${course.price}`}
          </button>
        )
      )}

      {message && <p className="status">{message}</p>}

      {/* Progress bar */}
      {isEnrolled && lessons.length > 0 && (
        <div className="progress-wrapper">
          <div className="progress-label">
            <span>Your Progress</span>
            <span>{completedCount}/{lessons.length} lessons ({progressPercent}%)</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Final test CTA */}
      {isEnrolled && course.hasQuiz && completedCount === lessons.length && lessons.length > 0 && (
        <div className="quiz-cta">
          {enrollment.certificateIssued ? (
            <>
              <p>✅ You passed the final test with {enrollment.quizScore}%!</p>
              <Link to={`/courses/${id}/certificate`} className="btn-solid">View Certificate</Link>
            </>
          ) : (
            <>
              <p>🎉 You've completed all lessons! Ready to take the final test?</p>
              <Link to={`/courses/${id}/quiz`} className="btn-solid">
                {enrollment.quizAttempts > 0 ? "Retake Final Test" : "Take Final Test"}
              </Link>
              {enrollment.quizAttempts > 0 && (
                <p style={{ marginTop: "0.5rem", color: "#6b7280", fontSize: "0.85rem" }}>
                  Last attempt: {enrollment.quizScore}% (needs 80% to pass)
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Lesson player */}
      {lessons.length === 0 ? (
        <p style={{ marginTop: "1.5rem" }}>No lessons added yet.</p>
      ) : (
        <div className="lesson-player">
          <aside className="lesson-sidebar">
            <h3>Course Content</h3>
            {lessons.map((lesson, index) => (
              <button
                key={lesson._id || index}
                className={`lesson-sidebar-item ${index === activeLessonIndex ? "active" : ""}`}
                onClick={() => setActiveLessonIndex(index)}
              >
                <span className="lesson-check">
                  {isEnrolled && isLessonDone(lesson._id) ? "✅" : "○"}
                </span>
                <span>{index + 1}. {lesson.title}</span>
              </button>
            ))}
          </aside>

          <main className="lesson-main">
            {/* Show lesson content only if enrolled (or instructor) */}
            {!isEnrolled && !isInstructorView ? (
              <div className="locked-lesson">
                <p>🔒 Enroll in this course to access all lessons.</p>
                {isFree ? (
                  <button onClick={handleFreeEnroll} className="btn-solid">Enroll for Free</button>
                ) : (
                  <button onClick={handlePaidEnroll} className="btn-solid" disabled={paying}>
                    {paying ? "Processing..." : `Buy Now — ₹${course.price}`}
                  </button>
                )}
              </div>
            ) : (
              <>
                <h2>{activeLesson.title}</h2>
                {activeLesson.videoUrl && (
                  <div className="video-wrapper">
                    <iframe
                      src={getEmbedUrl(activeLesson.videoUrl)}
                      title={activeLesson.title}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                )}
                {activeLesson.content && (
                  <div className="lesson-text"><p>{activeLesson.content}</p></div>
                )}
                {isEnrolled && (
                  <button
                    className={isLessonDone(activeLesson._id) ? "btn-outline" : "btn-solid"}
                    onClick={() => toggleComplete(activeLesson._id)}
                  >
                    {isLessonDone(activeLesson._id) ? "✅ Marked Complete (click to undo)" : "Mark as Complete"}
                  </button>
                )}
                <div className="lesson-nav-buttons">
                  <button disabled={activeLessonIndex === 0} onClick={() => setActiveLessonIndex(i => i - 1)} className="btn-outline">← Previous</button>
                  <button disabled={activeLessonIndex === lessons.length - 1} onClick={() => setActiveLessonIndex(i => i + 1)} className="btn-outline">Next →</button>
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
