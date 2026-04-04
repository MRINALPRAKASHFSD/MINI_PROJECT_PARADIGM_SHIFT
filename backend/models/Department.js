const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: String, default: '' },
  employeeCount: { type: Number, default: 0 },
  description: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  color: { type: String, default: '#4F46E5' },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
