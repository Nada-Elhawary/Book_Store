const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  adminCheck,
  getAllUsers,
} = require("../controllers/userController");
const {
  authMiddleware,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/users/help", (req, res) => {
  res.json({
    register: "POST /api/users/register (JSON: name, email, password)",
    login: "POST /api/users/login (JSON: email, password)",
    me: "GET /api/users/me (header: Authorization: Bearer <token>)",
    adminCheck: "GET /api/users/admin-check (Bearer token, admin only)",
    getAllUsers: "GET /api/user/help",
  });
});

router.get("/api/users/register", (req, res) => {
  res.status(405).json({
    message: "Use POST (not GET). Body: raw JSON with name, email, password.",
  });
});

router.get("/api/users/login", (req, res) => {
  res.status(405).json({
    message: "Use POST (not GET). Body: raw JSON with email, password.",
  });
});

router.post("/api/users/register", registerUser);
router.post("/api/users/login", loginUser);

router.get("/api/users/me", authMiddleware, getMe);
router.get("/api/users/admin-check", authMiddleware, requireAdmin, adminCheck);

router.route("/api/users").get(authMiddleware, requireAdmin, getAllUsers);
module.exports = router;
