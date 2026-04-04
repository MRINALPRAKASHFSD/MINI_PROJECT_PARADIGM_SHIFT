const express = require('express');
const Payslip = require('../models/Payslip');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/payslips
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.employee = req.user._id;
    if (req.query.employee) filter.employee = req.query.employee;

    const payslips = await Payslip.find(filter).populate('employee', 'name employeeId department').sort({ date: -1 });
    res.json({ payslips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payslips — generate (admin only)
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const payslip = await Payslip.create(req.body);
    res.status(201).json({ payslip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/payslips/:id
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const payslip = await Payslip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payslip) return res.status(404).json({ error: 'Payslip not found.' });
    res.json({ payslip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
