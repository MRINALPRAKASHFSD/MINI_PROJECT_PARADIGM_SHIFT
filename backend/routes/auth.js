const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Use env secrets when provided; fall back to a safe default so hosted envs without
// JWT_SECRET still issue tokens (avoids prod login breaking when env vars are missing).
const JWT_SECRET = process.env.JWT_SECRET || 'pshift_fallback_secret_set_env_asap';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET not set — using fallback secret. Set JWT_SECRET in env for security.');
}

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const count = await User.countDocuments();
    const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;

    const user = await User.create({ name, email, password, role: role || 'employee', employeeId });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;
    if (!email) return res.status(400).json({ error: 'Google email is required.' });

    let user = await User.findOne({ email });

    // If no user exists, auto-register them
    if (!user) {
      const count = await User.countDocuments();
      const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;
      const randomPassword = crypto.randomBytes(16).toString('hex');
      
      user = await User.create({
        name: name || 'Google User',
        email,
        password: randomPassword,
        role: 'employee',
        employeeId,
        avatar: photoURL || '',
      });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
