const express = require('express');
const Expense = require('../models/Expense');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/expenses
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.employee = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const expenses = await Expense.find(filter).populate('employee', 'name employeeId department').sort({ createdAt: -1 });
    const totals = {
      total: expenses.reduce((s, e) => s + e.amount, 0),
      pending: expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
      approved: expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
      rejected: expenses.filter(e => e.status === 'rejected').reduce((s, e) => s + e.amount, 0),
    };
    res.json({ expenses, totals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses — submit
router.post('/', auth, async (req, res) => {
  try {
    const count = await Expense.countDocuments();
    const expense = await Expense.create({
      ...req.body,
      employee: req.user._id,
      employeeName: req.user.name,
      department: req.user.department,
      receiptNo: `EXP-2026-${String(count + 1).padStart(3, '0')}`,
    });
    req.app.get('io').emit('DATA_UPDATED', { type: 'EXPENSES' });
    res.status(201).json({ expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id/approve
router.put('/:id/approve', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user._id }, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    req.app.get('io').emit('DATA_UPDATED', { type: 'EXPENSES' });
    res.json({ expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id/reject
router.put('/:id/reject', auth, authorize('admin', 'hr'), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: 'rejected', approvedBy: req.user._id }, { new: true });
    if (!expense) return res.status(404).json({ error: 'Expense not found.' });
    req.app.get('io').emit('DATA_UPDATED', { type: 'EXPENSES' });
    res.json({ expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, employee: req.user._id });
    req.app.get('io').emit('DATA_UPDATED', { type: 'EXPENSES' });
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
