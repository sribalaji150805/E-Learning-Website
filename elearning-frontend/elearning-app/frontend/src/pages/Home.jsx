// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    api.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Could not load courses. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // Build a unique list of categories from the loaded courses
  const categories = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];

  // Filter courses by search text + selected category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Learn New Skills, Anytime, Anywhere</h1>
          <p>Explore expert-led courses in programming, design, data science, and more.</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses (e.g. Python, Design, Marketing)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container">
        {loading && <p className="status">Loading courses...</p>}
        {error && <p className="status error">{error}</p>}

        {!loading && !error && (
          <>
            {/* Category filter pills */}
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="section-title">
              {activeCategory === "All" ? "All Courses" : activeCategory} ({filteredCourses.length})
            </h2>

            {filteredCourses.length === 0 && (
              <p>No courses match your search. Try a different keyword or category.</p>
            )}

            <div className="course-grid">
              {filteredCourses.map((course) => (
                <Link to={`/courses/${course._id}`} key={course._id} className="course-card">
                  <div className="course-thumb">{course.title.charAt(0)}</div>
                  <h3>{course.title}</h3>
                  <p className="course-desc">{course.description}</p>
                  <div className="course-meta">
                    <span>{course.category}</span>
                    <span>{course.price === 0 ? "Free" : `₹${course.price}`}</span>
                  </div>
                  <p className="course-instructor">By {course.instructor?.name}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
