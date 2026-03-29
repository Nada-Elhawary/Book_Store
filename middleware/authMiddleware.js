const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  try {
    if (!process.env.JWT_SECRET) {
      res.status(500);
      return next(new Error("Server configuration error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      return next(new Error("Not authorized, token expired"));
    }
    return next(new Error("Not authorized, invalid token"));
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Access denied: admin role required"));
  }
  next();
};

module.exports = { authMiddleware, requireAdmin };
