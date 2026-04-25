const express = require('express');
const Leave = require('../models/Leave');
const User = require('../models/User');
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
    req.app.get('io').emit('DATA_UPDATED', { type: 'LEAVES' });
    res.status(201).json({ leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/leaves/:id/approve — admin approves
router.put('/:id/approve', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found.' });
    if (leave.status !== 'pending') return res.status(400).json({ error: 'Leave already processed.' });

    // Deduct from balance
    const employee = await User.findById(leave.employee);
    if (employee) {
      const typeKey = leave.type.toLowerCase().split(' ')[0]; // 'casual', 'sick', 'vacation' -> map to balance keys
      const balanceMap = {
        'casual': 'casual',
        'sick': 'sick',
        'vacation': 'earned', // vacation maps to earned
        'personal': 'casual'  // personal maps to casual
      };
      
      const key = balanceMap[typeKey] || 'casual';
      if (employee.leaveBalances[key] >= leave.days) {
        employee.leaveBalances[key] -= leave.days;
        employee.leaveBalances.total -= leave.days;
        await employee.save();
      } else {
        // Optional: warn or prevent? For now just allow negative or handle
      }
    }

    leave.status = 'approved';
    leave.approvedBy = req.user._id;
    await leave.save();

    req.app.get('io').emit('DATA_UPDATED', { type: 'LEAVES' });
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
    req.app.get('io').emit('DATA_UPDATED', { type: 'LEAVES' });
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
    req.app.get('io').emit('DATA_UPDATED', { type: 'LEAVES' });
    res.json({ message: 'Leave cancelled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
