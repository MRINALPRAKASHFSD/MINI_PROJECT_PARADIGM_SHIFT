const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'HR', 'IT', 'Event', 'Policy', 'Urgent'], default: 'General' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: '' },
  pinned: { type: Boolean, default: false },
  companyName: { type: String, default: 'Paradigm Shift Inc.' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
