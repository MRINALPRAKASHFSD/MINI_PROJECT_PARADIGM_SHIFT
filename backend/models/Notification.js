const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['task', 'leave', 'system', 'team', 'achievement', 'expense', 'document'], default: 'system' },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
  companyName: { type: String, default: 'Paradigm Shift Inc.' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
