const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/attendance
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.employee = req.user._id;
    if (req.query.date) filter.date = new Date(req.query.date);
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from && req.query.to) {
      filter.date = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) };
    }

    const records = await Attendance.find(filter).populate('employee', 'name employeeId department').sort({ date: -1 });
    res.json({ attendance: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance — mark (admin/hr)
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json({ attendance: record });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Attendance already marked for this date.' });
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/attendance/:id
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ error: 'Record not found.' });
    res.json({ attendance: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
