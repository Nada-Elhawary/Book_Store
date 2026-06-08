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

router.get("/help", (req, res) => {
  res.json({
    register: "POST /api/users/register (JSON: name, email, password)",
    login: "POST /api/users/login (JSON: email, password)",
    me: "GET /api/users/me (header: Authorization: Bearer <token>)",
    adminCheck: "GET /api/users/admin-check (Bearer token, admin only)",
    getAllUsers: "GET /api/user/help",
  });
});

router.get("/register", (req, res) => {
  res.status(405).json({
    message: "Use POST (not GET). Body: raw JSON with name, email, password.",
  });
});

router.get("/login", (req, res) => {
  res.status(405).json({
    message: "Use POST (not GET). Body: raw JSON with email, password.",
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);
router.get("/admin-check", authMiddleware, requireAdmin, adminCheck);

router.route("/").get(authMiddleware, requireAdmin, getAllUsers);
module.exports = router;
