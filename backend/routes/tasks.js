const express = require('express');
const Task = require('../models/Task');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;
    const filter = { companyName: req.user.companyName };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    // Employees see only their tasks; admins see all
    if (req.user.role === 'employee') filter.assignee = req.user._id;

    const tasks = await Task.find(filter).populate('assignee', 'name email employeeId').sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks — create (admin/hr can assign to anyone)
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, companyName: req.user.companyName });
    req.app.get('io').emit('DATA_UPDATED', { type: 'TASKS' });
    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, companyName: req.user.companyName },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    req.app.get('io').emit('DATA_UPDATED', { type: 'TASKS' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, companyName: req.user.companyName });
    req.app.get('io').emit('DATA_UPDATED', { type: 'TASKS' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
