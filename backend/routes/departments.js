const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/departments
router.get('/', auth, async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ departments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/departments
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ department: dept });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/departments/:id
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ error: 'Department not found.' });
    res.json({ department: dept });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/departments/:id
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
