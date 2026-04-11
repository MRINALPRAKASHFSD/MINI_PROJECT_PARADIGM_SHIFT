const mongoose = require('mongoose');

const workspaceNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  color: { type: String, default: '#3b82f6' }, // For sticky note aesthetic
}, { timestamps: true });

module.exports = mongoose.model('WorkspaceNote', workspaceNoteSchema);
