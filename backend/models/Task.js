const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status: { type: String, enum: ['todo', 'inProgress', 'review', 'completed'], default: 'todo' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigneeName: { type: String, default: '' },
  category: { type: String, default: 'Engineering' },
  tags: [String],
  dueDate: { type: Date },
  reminderDate: { type: Date },
  isReminderSent: { type: Boolean, default: false },
  subtasks: [{ text: String, done: { type: Boolean, default: false } }],
  companyName: { type: String, default: 'Paradigm Shift Inc.' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
