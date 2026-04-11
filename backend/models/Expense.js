const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String, required: true },
  department: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Travel', 'Food', 'Software', 'Equipment', 'Training', 'Marketing', 'Other'], default: 'Other' },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  receiptNo: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, default: 'Paradigm Shift Inc.' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
