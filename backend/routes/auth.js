const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const count = await User.countDocuments();
    const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || 'employee', 
      employeeId,
      companyName: companyName || ''
    });
    const token = signToken(user._id);

    if (req.app.get('io')) {
      req.app.get('io').emit('DATA_UPDATED', { type: 'NEW_USER', user: user.toJSON() });
    }

    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('[AUTH_REGISTER_ERROR]', err.message);
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
    console.error('[AUTH_LOGIN_ERROR]', err.message);
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

      if (req.app.get('io')) {
        req.app.get('io').emit('DATA_UPDATED', { type: 'NEW_USER', user: user.toJSON() });
      }
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/setup-company
router.post('/setup-company', auth, async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) return res.status(400).json({ error: 'Company Name is required.' });

    const user = await User.findById(req.user._id);
    if (user.companyName) return res.status(400).json({ error: 'You are already in a company.' });

    user.companyName = companyName;
    await user.save();

    if (req.app.get('io')) {
      req.app.get('io').emit('DATA_UPDATED', { type: 'COMPANY_JOIN' });
    }

    res.json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
