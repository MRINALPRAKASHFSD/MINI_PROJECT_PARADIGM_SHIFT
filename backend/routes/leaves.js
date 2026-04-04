const express = require('express');
const Leave = require('../models/Leave');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaves
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.employee = req.user._id;
    if (req.query.status) filter.status = req.query.status;

    const leaves = await Leave.find(filter).populate('employee', 'name employeeId department').sort({ createdAt: -1 });
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leaves — apply for leave
router.post('/', auth, async (req, res) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      employee: req.user._id,
      employeeName: req.user.name,
    });
    res.status(201).json({ leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/leaves/:id/approve — admin approves
router.put('/:id/approve', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user._id }, { new: true });
    if (!leave) return res.status(404).json({ error: 'Leave not found.' });
    res.json({ leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/leaves/:id/reject — admin rejects
router.put('/:id/reject', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status: 'rejected', approvedBy: req.user._id }, { new: true });
    if (!leave) return res.status(404).json({ error: 'Leave not found.' });
    res.json({ leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leaves/:id — cancel own leave
router.delete('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findOne({ _id: req.params.id, employee: req.user._id, status: 'pending' });
    if (!leave) return res.status(404).json({ error: 'Leave not found or cannot be cancelled.' });
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave cancelled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
