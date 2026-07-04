// models/User.js
// Blueprint for a "User" document in MongoDB (students & instructors)

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique = no two users with same email
    password: { type: String, required: true }, // we will store this HASHED, never plain text
    role: { type: String, enum: ["student", "instructor"], default: "student" },
    enrolledCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" } // references Course documents
    ]
  },
  { timestamps: true } // automatically adds createdAt & updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
