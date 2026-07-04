// middleware/authMiddleware.js
// This checks if a request has a valid login token before allowing access to protected routes

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, role) to the request
    next(); // continue to the actual route
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Only allow certain roles (e.g. only instructors can create courses)
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
