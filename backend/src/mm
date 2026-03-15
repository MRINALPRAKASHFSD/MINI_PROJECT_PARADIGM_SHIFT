const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { asyncHandler } = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = new User({ name, email, passwordHash: "temp", role: role || "employee" });
  await user.setPassword(password);
  await user.save();

  const token = signToken({ sub: user._id, role: user.role });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.validatePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ sub: user._id, role: user.role });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

module.exports = { register, login };
