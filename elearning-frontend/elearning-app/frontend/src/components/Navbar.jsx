// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">📚 EduLearn</Link>

      <div className="nav-links">
        <Link to="/">Courses</Link>

        {user ? (
          <>
            {user.role === "instructor" && (
              <Link to="/create-course">Create Course</Link>
            )}
            <Link to="/dashboard">Dashboard</Link>
            <span className="nav-user">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-solid">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
