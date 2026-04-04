const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/employees — list all (admin/hr)
router.get('/', auth, async (req, res) => {
  try {
    const { department, status, search } = req.query;
    const filter = { role: 'employee' };
    if (department && department !== 'All') filter.department = department;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    const employees = await User.find(filter).sort({ createdAt: -1 });
    res.json({ employees, total: employees.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employees/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/employees/:id — update (admin only)
router.put('/:id', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // never update password here
    const employee = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/employees/:id — delete (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });
    res.json({ message: 'Employee deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
