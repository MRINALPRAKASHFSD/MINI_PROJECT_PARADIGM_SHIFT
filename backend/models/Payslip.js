const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: Date, required: true },
  basic: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  special: { type: Number, default: 0 },
  pf: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  pt: { type: Number, default: 0 },
  insurance: { type: Number, default: 0 },
  netPay: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'generated', 'paid'], default: 'generated' },
  companyName: { type: String, default: 'Paradigm Shift Inc.' }
}, { timestamps: true });

module.exports = mongoose.model('Payslip', payslipSchema);
