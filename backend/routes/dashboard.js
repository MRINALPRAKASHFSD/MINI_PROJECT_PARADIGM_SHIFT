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
    const companyFilter = { companyName: req.user.companyName };
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
      User.countDocuments({ role: 'employee', ...companyFilter }),
      User.countDocuments({ role: 'employee', status: 'Active', ...companyFilter }),
      Leave.countDocuments({ status: 'pending', ...companyFilter }),
      User.distinct('department', companyFilter).then(d => d.filter(Boolean).length),
      Expense.countDocuments({ status: 'pending', ...companyFilter }),
      Document.countDocuments({ status: 'pending', ...companyFilter }),
      Task.countDocuments(companyFilter),
      Task.countDocuments({ status: 'completed', ...companyFilter }),
    ]);

    // Today's attendance
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const presentToday = await Attendance.countDocuments({ date: { $gte: todayStart }, status: 'Present', ...companyFilter });

    // Total payroll
    const payrollAgg = await User.aggregate([{ $match: { role: 'employee', ...companyFilter } }, { $group: { _id: null, total: { $sum: '$salary' } } }]);
    const totalPayroll = payrollAgg[0]?.total || 0;

    // Expense totals
    const expenseAgg = await Expense.aggregate([
      { $match: companyFilter },
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
