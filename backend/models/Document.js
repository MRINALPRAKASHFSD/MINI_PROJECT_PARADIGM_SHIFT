const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String, required: true },
  department: { type: String, default: '' },
  name: { type: String, required: true },
  category: { type: String, enum: ['Identity', 'Tax', 'Education', 'Employment', 'Banking', 'Insurance', 'Certification', 'Other'], default: 'Other' },
  fileName: { type: String, default: '' },
  size: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
