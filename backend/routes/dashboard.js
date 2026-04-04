const express = require('express');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Expense = require('../models/Expense');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats — aggregated stats for admin dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      pendingLeaves,
      totalDepartments,
      pendingExpenses,
      pendingDocs,
      totalTasks,
      completedTasks,
    ] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      User.countDocuments({ role: 'employee', status: 'Active' }),
      Leave.countDocuments({ status: 'pending' }),
      User.distinct('department').then(d => d.filter(Boolean).length),
      Expense.countDocuments({ status: 'pending' }),
      Document.countDocuments({ status: 'pending' }),
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
    ]);

    // Today's attendance
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const presentToday = await Attendance.countDocuments({ date: { $gte: todayStart }, status: 'Present' });

    // Total payroll
    const payrollAgg = await User.aggregate([{ $match: { role: 'employee' } }, { $group: { _id: null, total: { $sum: '$salary' } } }]);
    const totalPayroll = payrollAgg[0]?.total || 0;

    // Expense totals
    const expenseAgg = await Expense.aggregate([
      { $group: { _id: '$status', total: { $sum: '$amount' } } },
    ]);
    const expenseTotals = {};
    expenseAgg.forEach(e => { expenseTotals[e._id] = e.total; });

    res.json({
      totalEmployees,
      activeEmployees,
      pendingLeaves,
      totalDepartments,
      presentToday,
      totalPayroll,
      pendingExpenses,
      pendingDocs,
      totalTasks,
      completedTasks,
      expenseTotals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
