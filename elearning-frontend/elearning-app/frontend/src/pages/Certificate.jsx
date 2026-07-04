// src/pages/Certificate.jsx
// A printable certificate of completion, shown only if the student passed the course's final test

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Certificate() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        const enrollRes = await api.get(`/enrollments/${id}`);
        setEnrollment(enrollRes.data);
      } catch {
        setError("Could not load certificate details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  if (!enrollment?.certificateIssued) {
    return (
      <div className="container">
        <p className="status error">
          You haven't earned a certificate for this course yet. You need to score at least 80% on the final test.
        </p>
        <Link to={`/courses/${id}/quiz`} className="btn-solid">Take the Test</Link>
      </div>
    );
  }

  const dateStr = new Date(enrollment.updatedAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="container">
      <div className="certificate-card" id="certificate">
        <div className="certificate-border">
          <p className="certificate-brand">📚 EduLearn</p>
          <h1 className="certificate-title">Certificate of Completion</h1>
          <p className="certificate-sub">This is to certify that</p>
          <p className="certificate-name">{user?.name}</p>
          <p className="certificate-sub">has successfully completed the course</p>
          <p className="certificate-course">{course?.title}</p>
          <p className="certificate-sub">
            with a final test score of <strong>{enrollment.quizScore}%</strong>
          </p>
          <div className="certificate-footer">
            <div>
              <p className="certificate-line">{dateStr}</p>
              <p className="certificate-caption">Date Issued</p>
            </div>
            <div>
              <p className="certificate-line">EduLearn Platform</p>
              <p className="certificate-caption">Issuing Authority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print" style={{ marginTop: "1.5rem" }}>
        <button onClick={() => window.print()} className="btn-solid">Print / Save as PDF</button>
        <Link to="/dashboard" className="btn-outline" style={{ marginLeft: "0.6rem" }}>Back to Dashboard</Link>
      </div>
    </div>
  );
}
