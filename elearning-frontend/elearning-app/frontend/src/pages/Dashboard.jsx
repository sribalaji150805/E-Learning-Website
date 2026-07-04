// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);     // used for instructor view
  const [enrollments, setEnrollments] = useState([]); // used for student view (with progress)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.role === "instructor") {
          const res = await api.get("/courses");
          setCourses(res.data.filter((c) => (c.instructor?._id || c.instructor) === user.id));
        } else {
          const res = await api.get("/enrollments"); // my enrolled courses + progress
          setEnrollments(res.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p className="status">Loading dashboard...</p>;

  return (
    <div className="container">
      <h1>Welcome, {user?.name} 👋</h1>
      <p className="role-badge">{user?.role === "instructor" ? "Instructor" : "Student"} Dashboard</p>

      {user?.role === "instructor" ? (
        <>
          <h2>Your Courses</h2>
          {courses.length === 0 ? (
            <p>You haven't created any courses yet.</p>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <Link to={`/courses/${course._id}`} key={course._id} className="course-card">
                  <div className="course-thumb">{course.title.charAt(0)}</div>
                  <h3>{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                </Link>
              ))}
            </div>
          )}
          <Link to="/create-course" className="btn-solid" style={{ marginTop: "1rem", display: "inline-block" }}>
            + Create New Course
          </Link>
        </>
      ) : (
        <>
          <h2>My Enrolled Courses</h2>
          {enrollments.length === 0 ? (
            <p>
              You haven't enrolled in any courses yet. <Link to="/">Browse courses</Link> to get started!
            </p>
          ) : (
            <div className="course-grid">
              {enrollments.map((enr) => {
                const course = enr.course;
                if (!course) return null;
                const total = course.lessons?.length || 0;
                const done = enr.completedLessons?.length || 0;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <Link to={`/courses/${course._id}`} key={enr._id} className="course-card">
                    <div className="course-thumb">{course.title.charAt(0)}</div>
                    <h3>{course.title}</h3>
                    <p className="course-desc">{course.description}</p>
                    <div className="progress-wrapper">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{done}/{total} ({percent}%)</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    {enr.certificateIssued && (
                      <p className="certificate-badge">🎓 Certificate Earned ({enr.quizScore}%)</p>
                    )}
                    {!enr.certificateIssued && enr.quizAttempts > 0 && (
                      <p className="certificate-badge-pending">Last test score: {enr.quizScore}% (needs 80%)</p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
