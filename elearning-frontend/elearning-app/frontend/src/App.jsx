// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import QuizPage from "./pages/QuizPage";
import Certificate from "./pages/Certificate";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses/:id" element={<CourseDetails />} />

          <Route path="/courses/:id/quiz" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />

          <Route path="/courses/:id/certificate" element={
            <ProtectedRoute><Certificate /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/create-course" element={
            <ProtectedRoute roleRequired="instructor"><CreateCourse /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
