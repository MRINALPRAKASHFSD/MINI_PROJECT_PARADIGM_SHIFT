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

// GET /api/attendance/today — get status for logged in employee
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: today
    });
    
    res.json({ attendance: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance/clock-in
router.post('/clock-in', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const existing = await Attendance.findOne({ employee: req.user._id, date: today });
    if (existing) return res.status(400).json({ error: 'Already clocked in today.' });

    const record = await Attendance.create({
      employee: req.user._id,
      employeeName: req.user.name,
      date: today,
      checkIn: checkInTime,
      status: 'Present',
      companyName: req.user.companyName || 'Paradigm Shift Inc.'
    });

    req.app.get('io').emit('DATA_UPDATED', { type: 'ATTENDANCE' });
    res.status(201).json({ attendance: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance/clock-out
router.post('/clock-out', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const record = await Attendance.findOne({ employee: req.user._id, date: today });
    if (!record) return res.status(404).json({ error: 'No clock-in record found for today.' });
    if (record.checkOut) return res.status(400).json({ error: 'Already clocked out today.' });

    record.checkOut = checkOutTime;
    
    // Calculate hours worked
    if (record.checkIn) {
      const [inH, inM] = record.checkIn.split(':').map(Number);
      const [outH, outM] = checkOutTime.split(':').map(Number);
      const diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
      record.hoursWorked = parseFloat((diffMinutes / 60).toFixed(2));
    }

    await record.save();
    req.app.get('io').emit('DATA_UPDATED', { type: 'ATTENDANCE' });
    res.json({ attendance: record });
  } catch (err) {
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
