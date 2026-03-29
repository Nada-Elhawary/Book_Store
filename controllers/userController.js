const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      res.status(400);
      return next(new Error("Please provide name, email, and password"));
    }

    if (password.length < 6) {
      res.status(400);
      return next(new Error("Password must be at least 6 characters"));
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(400);
      return next(new Error("User already exists with this email"));
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
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error("Please provide email and password"));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    res.json(toPublicUser(user));
  } catch (err) {
    next(err);
  }
};

const adminCheck = (req, res) => {
  res.json({ message: "Admin access granted", user: req.user });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  adminCheck,
};
