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

// POST /api/employees — create (admin only)
router.post('/', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const { name, email, department, designation, salary, phone, joiningDate, address } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    // Safely generate next employeeId
    const lastUser = await User.findOne({ role: 'employee' }).sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastUser && lastUser.employeeId && lastUser.employeeId.startsWith('EMP')) {
      const lastNum = parseInt(lastUser.employeeId.replace('EMP', ''));
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const employeeId = `EMP${String(nextNum).padStart(3, '0')}`;
    
    // Default password is 'Welcome@123'
    const user = await User.create({
      name,
      email,
      password: 'Welcome@123',
      role: 'employee',
      employeeId,
      department,
      designation,
      salary,
      phone,
      joiningDate,
      address,
      status: 'Active'
    });

    res.status(201).json({ employee: user.toJSON() });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `Duplicate ${field}: This value is already in use.` });
    }
    console.error('[EMPLOYEE_CREATE_ERROR]', err.message);
    res.status(500).json({ error: 'Internal server error occurred while saving.' });
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
