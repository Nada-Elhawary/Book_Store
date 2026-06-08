const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { __v: false, password: false });

    res.status(200).json({
      status: 200,
      message: "All Users Received Successfully",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: err.message,
    });
  }
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const toPublicUser = (userDoc) => ({
  id: userDoc._id.toString(),
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(toPublicUser(user));
  } catch (err) {
    console.error("GetMe Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const adminCheck = (req, res) => {
  res.json({ message: "Admin access granted", user: req.user });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getMe,
  adminCheck,
};
